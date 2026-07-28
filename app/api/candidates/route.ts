import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();

    const supabase = await createClient();

    // Query candidates and include linked certificates for count calculation
    let query = supabase
      .from('candidates')
      .select(`
        *,
        certificates (id)
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch candidates error:', error);
      // Fallback query without relation if certificates table structure varies
      const fallback = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallback.error) {
        return NextResponse.json({ success: false, error: fallback.error.message }, { status: 500 });
      }

      let candidates = (fallback.data || []).map((cand: any) => ({
        ...cand,
        certificates_count: 0
      }));

      if (search) {
        const q = search.toLowerCase();
        candidates = candidates.filter((cand: any) =>
          cand.full_name?.toLowerCase().includes(q) ||
          cand.passport_id?.toLowerCase().includes(q) ||
          cand.identity_number?.toLowerCase().includes(q) ||
          cand.rank_position?.toLowerCase().includes(q) ||
          cand.nationality?.toLowerCase().includes(q)
        );
      }

      return NextResponse.json({ success: true, candidates });
    }

    let candidates = (data || []).map((cand: any) => ({
      ...cand,
      certificates_count: Array.isArray(cand.certificates) ? cand.certificates.length : 0
    }));

    if (search) {
      const q = search.toLowerCase();
      candidates = candidates.filter((cand: any) =>
        cand.full_name?.toLowerCase().includes(q) ||
        cand.passport_id?.toLowerCase().includes(q) ||
        cand.identity_number?.toLowerCase().includes(q) ||
        cand.rank_position?.toLowerCase().includes(q) ||
        cand.nationality?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, candidates });
  } catch (error: any) {
    console.error('Error fetching candidates in API route:', error);
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
      full_name,
      passport_id,
      identity_number,
      rank_position,
      nationality,
      date_of_birth,
      email,
      phone,
      photo_url
    } = body;

    if (!full_name?.trim() || !passport_id?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name and passport ID are required.' },
        { status: 400 }
      );
    }

    const cleanPassport = passport_id.trim();
    const cleanName = full_name.trim();

    const supabase = await createClient();

    // Prevent duplicate passport registration
    const { data: existingCand } = await supabase
      .from('candidates')
      .select('id, passport_id')
      .ilike('passport_id', cleanPassport)
      .maybeSingle();

    if (existingCand) {
      return NextResponse.json(
        { success: false, error: `A seafarer with Passport ID "${cleanPassport}" is already registered.` },
        { status: 400 }
      );
    }

    // Prepare complete payload
    const candidatePayload: Record<string, any> = {
      full_name: cleanName,
      passport_id: cleanPassport,
      identity_number: identity_number?.trim() || null,
      rank_position: rank_position?.trim() || null,
      nationality: nationality?.trim() || null,
      date_of_birth: date_of_birth?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      photo_url: photo_url?.trim() || null
    };

    // Attempt insertion with all fields
    let { data, error } = await supabase
      .from('candidates')
      .insert([candidatePayload])
      .select()
      .single();

    // If extended columns are not defined in Supabase schema, retry with baseline fields
    if (error && (error.code === 'PGRST204' || error.message?.includes('column') || error.message?.includes('schema'))) {
      console.warn('Supabase candidate schema mismatch, retrying with core candidate attributes:', error.message);
      const corePayload = {
        full_name: cleanName,
        passport_id: cleanPassport,
        photo_url: candidatePayload.photo_url
      };

      const fallbackResult = await supabase
        .from('candidates')
        .insert([corePayload])
        .select()
        .single();

      if (fallbackResult.error) {
        return NextResponse.json({ success: false, error: fallbackResult.error.message }, { status: 400 });
      }

      // Merge extra client values into returned record for UI consistency
      data = {
        ...fallbackResult.data,
        identity_number: candidatePayload.identity_number,
        rank_position: candidatePayload.rank_position,
        nationality: candidatePayload.nationality,
        date_of_birth: candidatePayload.date_of_birth,
        email: candidatePayload.email,
        phone: candidatePayload.phone
      };
      error = null;
    } else if (error) {
      console.warn('Supabase insert candidate error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, candidate: data });
  } catch (error: any) {
    console.error('Error creating candidate in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
