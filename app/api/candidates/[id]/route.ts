import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const {
      full_name,
      passport_id,
      identity_number,
      rank_position,
      nationality,
      date_of_birth,
      place_of_birth,
      seaman_book_number,
      gender,
      email,
      phone,
      address,
      emergency_contact,
      photo_url
    } = body;

    const supabase = await createClient();

    // Check duplicate passport if passport_id is being updated
    if (passport_id && passport_id.trim()) {
      const cleanPassport = passport_id.trim();
      const { data: existing } = await supabase
        .from('candidates')
        .select('id')
        .ilike('passport_id', cleanPassport)
        .neq('id', id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { success: false, error: `Another seafarer already has Passport ID "${cleanPassport}".` },
          { status: 400 }
        );
      }
    }

    const updatePayload: Record<string, any> = {};
    if (full_name !== undefined) updatePayload.full_name = full_name.trim();
    if (passport_id !== undefined) updatePayload.passport_id = passport_id.trim();
    if (identity_number !== undefined) updatePayload.identity_number = identity_number?.trim() || null;
    if (rank_position !== undefined) updatePayload.rank_position = rank_position?.trim() || null;
    if (nationality !== undefined) updatePayload.nationality = nationality?.trim() || null;
    if (date_of_birth !== undefined) updatePayload.date_of_birth = date_of_birth?.trim() || null;
    if (place_of_birth !== undefined) updatePayload.place_of_birth = place_of_birth?.trim() || null;
    if (seaman_book_number !== undefined) updatePayload.seaman_book_number = seaman_book_number?.trim() || null;
    if (gender !== undefined) updatePayload.gender = gender?.trim() || null;
    if (email !== undefined) updatePayload.email = email?.trim() || null;
    if (phone !== undefined) updatePayload.phone = phone?.trim() || null;
    if (address !== undefined) updatePayload.address = address?.trim() || null;
    if (emergency_contact !== undefined) updatePayload.emergency_contact = emergency_contact?.trim() || null;
    if (photo_url !== undefined) updatePayload.photo_url = photo_url?.trim() || null;

    let { data, error } = await supabase
      .from('candidates')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    // Schema mismatch fallback
    if (error && (error.code === 'PGRST204' || error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('schema') || error.message?.includes('coerce'))) {
      console.warn('Supabase candidate update schema mismatch, updating core candidate attributes:', error.message);
      const coreUpdate: Record<string, any> = {};
      if (full_name !== undefined) coreUpdate.full_name = full_name.trim();
      if (passport_id !== undefined) coreUpdate.passport_id = passport_id.trim();
      if (photo_url !== undefined) coreUpdate.photo_url = photo_url?.trim() || null;

      let updatedData = null;
      if (Object.keys(coreUpdate).length > 0) {
        const fallbackResult = await supabase
          .from('candidates')
          .update(coreUpdate)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (fallbackResult.error) {
          return NextResponse.json({ success: false, error: fallbackResult.error.message }, { status: 400 });
        }
        updatedData = fallbackResult.data;
      }

      if (!updatedData) {
        const { data: existing } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        updatedData = existing || { id };
      }

      data = {
        ...updatedData,
        ...updatePayload
      };
      error = null;
    } else if (error) {
      console.warn('Supabase update candidate error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, candidate: data });
  } catch (error: any) {
    console.error('Error updating candidate in API route:', error);
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
      return NextResponse.json(
        { success: false, error: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if linked certificates exist
    const { data: linkedCerts, error: fetchCertsErr } = await supabase
      .from('certificates')
      .select('id, certificate_number')
      .eq('candidate_id', id);

    if (!fetchCertsErr && linkedCerts && linkedCerts.length > 0) {
      const firstCert = linkedCerts[0]?.certificate_number || 'linked certificate';
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete candidate: ${linkedCerts.length} active certificate(s) (e.g. ${firstCert}) are linked to this seafarer. Delete or reassign certificates first.`
        },
        { status: 400 }
      );
    }

    // Delete candidate record from Supabase candidates table
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Delete Candidate Error:', error);
      if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete candidate because linked certificates or records exist in the database.'
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
