import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active_only') === 'true';

    const supabase = await createClient();
    let query = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch courses error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Standardize default is_active if column value is null
    const courses = (data || []).map((course) => ({
      ...course,
      is_active: course.is_active ?? true
    }));

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    console.error('Error fetching courses in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_code, title, category = 'STCW', description = '' } = body;

    if (!course_code?.trim() || !title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Course code and title are required.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const coursePayload = {
      course_code: course_code.trim(),
      title: title.trim(),
      category: category.trim() || 'STCW',
      description: description.trim()
    };

    const { data, error } = await supabase
      .from('courses')
      .insert([coursePayload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert course error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, course: data });
  } catch (error: any) {
    console.error('Error creating course in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
