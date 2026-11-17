import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidate: candidateData,
      course_id: courseId,
      issue_date: issueDate,
      expiry_date: expiryDate,
      details = {}
    } = body;

    if (!candidateData?.full_name || !candidateData?.passport_id || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Candidate name, passport ID, and course ID are required.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Upsert / Find Candidate by passport_id
    const passportId = candidateData.passport_id.trim().toUpperCase();
    const fullName = candidateData.full_name.trim().toUpperCase();
    const photoUrl = candidateData.photo_url?.trim() || null;

    let candidateRecord;

    const { data: existingCand, error: candFindError } = await supabase
      .from('candidates')
      .select('*')
      .eq('passport_id', passportId)
      .maybeSingle();

    if (candFindError && candFindError.code !== 'PGRST116') {
      console.warn('Supabase candidate lookup error:', candFindError);
    }

    if (existingCand) {
      // Update name/photo if updated
      const { data: updatedCand } = await supabase
        .from('candidates')
        .update({ full_name: fullName, photo_url: photoUrl })
        .eq('id', existingCand.id)
        .select()
        .single();

      candidateRecord = updatedCand || existingCand;
    } else {
      // Create new candidate with auto-generated 9-digit identity_number
      const identityNum = candidateData.identity_number?.trim() || Math.floor(100000000 + Math.random() * 900000000).toString();
      const { data: newCand, error: createCandErr } = await supabase
        .from('candidates')
        .insert([
          {
            full_name: fullName,
            passport_id: passportId,
            identity_number: identityNum,
            photo_url: photoUrl
          }
        ])
        .select()
        .single();

      if (createCandErr || !newCand) {
        console.error("CRITICAL SUPABASE CANDIDATE INSERT ERROR:", JSON.stringify(createCandErr, null, 2));
        return NextResponse.json(
          { success: false, error: `Failed to store candidate record: ${createCandErr?.message || 'Unknown database error'}` },
          { status: 500 }
        );
      }
      candidateRecord = newCand;
    }

    // 2. Generate Cryptographically Secure Verification Hash & Barcode Number
    const verificationHash = crypto.randomBytes(16).toString('hex');
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const certNumber = details.certificate_number?.trim() || `UAG-TC-26-ASE-${randomNum}`;
    const numericHash = details.numeric_hash?.trim() || Math.floor(10000000000000 + Math.random() * 90000000000000).toString();

    // 3. Prepare Full Certificate DB Record Payload
    const fullCertPayload = {
      certificate_number: certNumber,
      candidate_id: candidateRecord.id,
      course_id: courseId,
      issue_date: issueDate || new Date().toISOString().split('T')[0],
      expiry_date: expiryDate || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: details.status || 'VALID',
      verification_hash: verificationHash,
      salutation: details.salutation || 'Mr.',
      stcw_regulation: details.stcw_regulation || 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
      resolution_number: details.resolution_number || 'DGGM-CFM-005-2025',
      resolution_date: details.resolution_date || '2024-02-06',
      resolution_expiry: details.resolution_expiry || '2026-06-12',
      held_from: details.held_from || '2026-03-10',
      held_to: details.held_to || '2026-04-10',
      course_mode: details.course_mode || 'Presential',
      conducted_at: details.conducted_at || 'AZERBAIJAN',
      validity_years_text: details.validity_years_text || '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
      revision_code: details.revision_code || 'REV. 2/2025',
      numeric_hash: numericHash
    };

    // 4. Insert Certificate into Supabase DB with Resilient Fallback
    let insertedCert = null;
    let { data: primaryData, error: certInsertErr } = await supabase
      .from('certificates')
      .insert([fullCertPayload])
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .single();

    if (!certInsertErr && primaryData) {
      insertedCert = primaryData;
    } else {
      console.warn("Full payload insert failed, trying resilient schema fallback:", certInsertErr?.message);

      // Core baseline payload guaranteed to exist on certificates table schema
      const coreCertPayload = {
        certificate_number: certNumber,
        candidate_id: candidateRecord.id,
        course_id: courseId,
        issue_date: issueDate || new Date().toISOString().split('T')[0],
        expiry_date: expiryDate || new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: details.status || 'VALID',
        verification_hash: verificationHash
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
        console.error("CRITICAL SUPABASE INSERT ERROR:", JSON.stringify(fallbackErr || certInsertErr, null, 2));
        return NextResponse.json(
          { success: false, error: `Failed to store certificate: ${fallbackErr?.message || certInsertErr?.message}` },
          { status: 500 }
        );
      }

      // Merge extended fields onto fallback returned record for presentation/PDF export
      insertedCert = {
        ...fullCertPayload,
        ...fallbackData
      };
    }

    // 5. Construct Public Verification URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://panama-ctc.com');
    const verificationUrl = `${baseUrl.replace(/\/$/, '')}/verify/${verificationHash}`;

    return NextResponse.json({
      success: true,
      certificate: insertedCert,
      candidate: candidateRecord,
      verification_hash: verificationHash,
      verification_url: verificationUrl
    });

  } catch (error: any) {
    console.error('Error generating certificate in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
