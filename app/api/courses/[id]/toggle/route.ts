import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Course ID is required.' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch current course state
    const { data: currentCourse, error: fetchErr } = await supabase
      .from('courses')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchErr || !currentCourse) {
      return NextResponse.json({ success: false, error: 'Course not found.' }, { status: 44 });
    }

    let nextState = !currentCourse.is_active;

    // Support optional explicitly passed is_active state in body if provided
    try {
      const body = await request.json();
      if (typeof body?.is_active === 'boolean') {
        nextState = body.is_active;
      }
    } catch {
      // Body may be empty for simple toggle
    }

    const { data: updatedCourse, error: updateErr } = await supabase
      .from('courses')
      .update({ is_active: nextState })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      console.warn('Supabase toggle course status error:', updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error: any) {
    console.error('Error toggling course status in API route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
