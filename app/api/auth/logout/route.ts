import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore if auth session doesn't exist
    }

    const cookieStore = await cookies();
    cookieStore.delete('ctc_admin_auth');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
