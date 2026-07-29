import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

function normalizeStatus(status?: string): 'VALID' | 'EXPIRED' | 'REVOKED' {
  if (!status) return 'VALID';
  const upper = status.toUpperCase().trim();
  if (upper === 'ACTIVE' || upper === 'VALID') return 'VALID';
  if (upper === 'INVALID' || upper === 'REVOKED') return 'REVOKED';
  if (upper === 'EXPIRED') return 'EXPIRED';
  return 'VALID';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();

    const supabase = await createClient();

    let query = supabase
      .from('certificates')
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .order('created_at', { ascending: false });

    const { data: certs, error } = await query;

    if (error) {
      console.warn('Supabase fetch certificates error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    let filtered = certs || [];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((cert: any) => {
        const certNum = cert.certificate_number?.toLowerCase() || '';
        const hash = cert.verification_hash?.toLowerCase() || '';
        const name = cert.candidate?.full_name?.toLowerCase() || '';
        const passport = cert.candidate?.passport_id?.toLowerCase() || '';
        const identityNum = cert.candidate?.identity_number?.toLowerCase() || '';
        const courseTitle = cert.course?.title?.toLowerCase() || '';

        return (
          certNum.includes(q) ||
          hash.includes(q) ||
          name.includes(q) ||
          passport.includes(q) ||
          identityNum.includes(q) ||
          courseTitle.includes(q)
        );
      });
    }

    return NextResponse.json({
      success: true,
      certificates: filtered
    });
  } catch (error: any) {
    console.error('Error fetching certificates in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidate_id,
      candidate,
      course_id,
      issue_date,
      expiry_date,
      certificate_number,
      reference_code,
      verification_hash,
      hash,
      status,
      salutation,
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
      numeric_hash
    } = body;

    const supabase = await createClient();

    let targetCandidateId = candidate_id;

    // If no candidate_id, but candidate details provided, upsert candidate
    if (!targetCandidateId && candidate?.passport_id) {
      const passportId = candidate.passport_id.trim().toUpperCase();
      const fullName = (candidate.full_name || '').trim().toUpperCase();
      const identityNumber = (candidate.identity_number || '').trim();
      const photoUrl = candidate.photo_url?.trim() || null;

      const { data: existingCand } = await supabase
        .from('candidates')
        .select('*')
        .eq('passport_id', passportId)
        .maybeSingle();

      if (existingCand) {
        targetCandidateId = existingCand.id;
        const candUpdates: Record<string, any> = {};
        if (fullName) candUpdates.full_name = fullName;
        if (identityNumber) candUpdates.identity_number = identityNumber;
        if (photoUrl) candUpdates.photo_url = photoUrl;

        if (Object.keys(candUpdates).length > 0) {
          await supabase.from('candidates').update(candUpdates).eq('id', existingCand.id);
        }
        const finalIdentityNumber = identityNumber || Math.floor(100000000 + Math.random() * 900000000).toString();
        const { data: newCand, error: createCandErr } = await supabase
          .from('candidates')
          .insert([
            {
              full_name: fullName,
              passport_id: passportId,
              identity_number: finalIdentityNumber,
              photo_url: photoUrl
            }
          ])
          .select()
          .single();

        if (createCandErr || !newCand) {
          return NextResponse.json({ success: false, error: createCandErr?.message || 'Failed to create candidate record' }, { status: 400 });
        }
        targetCandidateId = newCand.id;
      }
    }

    if (!targetCandidateId || !course_id) {
      return NextResponse.json(
        { success: false, error: 'Target candidate (or candidate details) and course_id are required.' },
        { status: 400 }
      );
    }

    const certNum = (reference_code || certificate_number || '').trim() || `UAG-TC-26-ASE-${Math.floor(10000 + Math.random() * 90000)}`;
    const certHash = (hash || verification_hash || '').trim() || crypto.randomBytes(16).toString('hex');
    const certNumHash = (numeric_hash || '').trim() || Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
    const certStatus = normalizeStatus(status);

    const fullCertPayload = {
      certificate_number: certNum,
      candidate_id: targetCandidateId,
      course_id: course_id,
      issue_date: issue_date || new Date().toISOString().split('T')[0],
      expiry_date: expiry_date || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: certStatus,
      verification_hash: certHash,
      salutation: salutation || 'Mr.',
      stcw_regulation: stcw_regulation || 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
      resolution_number: resolution_number || 'DGGM-CFM-005-2024',
      resolution_date: resolution_date || '2024-02-06',
      resolution_expiry: resolution_expiry || '2026-06-12',
      held_from: held_from || '2026-03-10',
      held_to: held_to || '2026-04-10',
      course_mode: course_mode || 'Presential',
      conducted_at: conducted_at || 'AZERBAIJAN',
      validity_years_text: validity_years_text || '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
      revision_code: revision_code || 'REV. 2/2024',
      numeric_hash: certNumHash
    };

    let insertedCert = null;
    let { data: primaryData, error: insertErr } = await supabase
      .from('certificates')
      .insert([fullCertPayload])
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .single();

    if (!insertErr && primaryData) {
      insertedCert = primaryData;
    } else {
      console.warn("Full payload insert failed in POST /api/certificates, trying core fallback:", insertErr?.message);

      const coreCertPayload = {
        certificate_number: certNum,
        candidate_id: targetCandidateId,
        course_id: course_id,
        issue_date: issue_date || new Date().toISOString().split('T')[0],
        expiry_date: expiry_date || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: certStatus,
        verification_hash: certHash
      };

      const { data: fallbackData, error: fallbackErr } = await supabase
        .from('certificates')
        .insert([coreCertPayload])
        .select(`
          *,
          candidate:candidates(*),
          course:courses(*)
        `)
        .single();

      if (fallbackErr || !fallbackData) {
        console.error("CRITICAL SUPABASE INSERT ERROR:", JSON.stringify(fallbackErr || insertErr, null, 2));
        return NextResponse.json({ success: false, error: `Failed to store certificate: ${fallbackErr?.message || insertErr?.message}` }, { status: 400 });
      }

      insertedCert = {
        ...fullCertPayload,
        ...fallbackData
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://panama-ctc.com');
    const verificationUrl = `${baseUrl.replace(/\/$/, '')}/verify/${certHash}`;

    return NextResponse.json({
      success: true,
      certificate: insertedCert,
      verification_hash: certHash,
      verification_url: verificationUrl
    });

  } catch (error: any) {
    console.error('Error creating certificate in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
