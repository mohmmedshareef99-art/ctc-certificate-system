import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('ctc_admin_auth');

    if (authCookie && authCookie.value) {
      try {
        const user = JSON.parse(authCookie.value);
        return NextResponse.json({ authenticated: true, user });
      } catch {
        // Invalid cookie format
      }
    }

    // Check Supabase Auth as secondary source
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const userObj = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator',
        role: user.user_metadata?.role || 'admin',
      };
      return NextResponse.json({ authenticated: true, user: userObj });
    }

    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
