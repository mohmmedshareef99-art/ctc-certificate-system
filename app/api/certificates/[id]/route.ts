import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required.' }, { status: 400 });
    }

    const {
      candidate_name,
      candidate_passport,
      candidate_photo,
      candidate_id,
      course_id,
      certificate_number,
      salutation,
      issue_date,
      expiry_date,
      stcw_regulation,
      resolution_number,
      resolution_date,
      resolution_expiry,
      held_from,
      held_to,
      course_mode,
      conducted_at,
      validity_years_text,
      revision_code,
      status
    } = body;

    const supabase = await createClient();

    // 1. Fetch current certificate to get candidate_id if not provided directly
    let targetCandId = candidate_id;
    if (!targetCandId) {
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('candidate_id')
        .eq('id', id)
        .single();
      if (existingCert) {
        targetCandId = existingCert.candidate_id;
      }
    }

    // 2. Update candidate record in Supabase if candidate_name or candidate_passport supplied
    if (targetCandId && (candidate_name || candidate_passport || candidate_photo)) {
      const candPayload: Record<string, any> = {};
      if (candidate_name !== undefined) candPayload.full_name = candidate_name.trim().toUpperCase();
      if (candidate_passport !== undefined) candPayload.passport_id = candidate_passport.trim().toUpperCase();
      if (candidate_photo !== undefined) candPayload.photo_url = candidate_photo.trim();

      const { error: candErr } = await supabase
        .from('candidates')
        .update(candPayload)
        .eq('id', targetCandId);

      if (candErr) {
        console.warn('Supabase candidate update warning:', candErr);
      }
    }

    // 3. Construct Certificate update payload
    const certPayload: Record<string, any> = {};
    if (certificate_number !== undefined) certPayload.certificate_number = certificate_number.trim();
    if (course_id !== undefined) certPayload.course_id = course_id;
    if (salutation !== undefined) certPayload.salutation = salutation.trim();
    if (issue_date !== undefined) certPayload.issue_date = issue_date;
    if (expiry_date !== undefined) certPayload.expiry_date = expiry_date;
    if (stcw_regulation !== undefined) certPayload.stcw_regulation = stcw_regulation.trim();
    if (resolution_number !== undefined) certPayload.resolution_number = resolution_number.trim();
    if (resolution_date !== undefined) certPayload.resolution_date = resolution_date;
    if (resolution_expiry !== undefined) certPayload.resolution_expiry = resolution_expiry;
    if (held_from !== undefined) certPayload.held_from = held_from;
    if (held_to !== undefined) certPayload.held_to = held_to;
    if (course_mode !== undefined) certPayload.course_mode = course_mode.trim();
    if (conducted_at !== undefined) certPayload.conducted_at = conducted_at.trim();
    if (validity_years_text !== undefined) certPayload.validity_years_text = validity_years_text.trim();
    if (revision_code !== undefined) certPayload.revision_code = revision_code.trim();
    if (status !== undefined) {
      const upper = String(status).toUpperCase().trim();
      if (upper === 'ACTIVE' || upper === 'VALID') {
        certPayload.status = 'VALID';
      } else if (upper === 'INVALID' || upper === 'REVOKED') {
        certPayload.status = 'REVOKED';
      } else if (upper === 'EXPIRED') {
        certPayload.status = 'EXPIRED';
      } else {
        certPayload.status = status;
      }
    }

    const { data: updatedCert, error: certErr } = await supabase
      .from('certificates')
      .update(certPayload)
      .eq('id', id)
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .single();

    if (certErr) {
      console.error('Supabase update certificate error:', certErr);
      return NextResponse.json({ success: false, error: certErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, certificate: updatedCert });
  } catch (error: any) {
    console.error('Error updating certificate in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete certificate error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting certificate in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
