import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. First attempt Supabase Auth (Native Supabase Auth)
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!authError && authData.user) {
        const userObj = {
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Administrator',
          role: authData.user.user_metadata?.role || 'admin',
          last_login: new Date().toISOString(),
        };

        const cookieStore = await cookies();
        cookieStore.set('ctc_admin_auth', JSON.stringify(userObj), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({
          success: true,
          message: 'Signed in successfully via Supabase Auth',
          user: userObj,
        });
      }
    } catch (authErr) {
      console.warn('Supabase Auth check skipped:', authErr);
    }

    // 2. Attempt Supabase custom `admin_users` table query
    try {
      const { data: dbUser, error: dbError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!dbError && dbUser) {
        const storedPassword = dbUser.password_hash || dbUser.password;
        if (storedPassword === cleanPassword) {
          const userObj = {
            id: dbUser.id,
            email: dbUser.email,
            full_name: dbUser.full_name || 'CTC Administrator',
            role: dbUser.role || 'admin',
            last_login: new Date().toISOString(),
          };

          // Update last_login in DB asynchronously
          supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', dbUser.id)
            .then();

          const cookieStore = await cookies();
          cookieStore.set('ctc_admin_auth', JSON.stringify(userObj), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
          });

          return NextResponse.json({
            success: true,
            message: 'Signed in successfully via Admin Database',
            user: userObj,
          });
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid email or password.' },
            { status: 401 }
          );
        }
      }
    } catch (dbErr) {
      console.warn('Supabase admin_users lookup fallback:', dbErr);
    }

    // 3. Fallback built-in admin credentials check (For initial deployment / fallback)
    const DEFAULT_ADMIN_EMAIL = 'admin@ctc.com.pa';
    const DEFAULT_ADMIN_PASS = 'admin123';

    if (cleanEmail === DEFAULT_ADMIN_EMAIL && cleanPassword === DEFAULT_ADMIN_PASS) {
      const userObj = {
        id: 'admin-001',
        email: DEFAULT_ADMIN_EMAIL,
        full_name: 'General Administrator CTC',
        role: 'superadmin',
        last_login: new Date().toISOString(),
      };

      const cookieStore = await cookies();
      cookieStore.set('ctc_admin_auth', JSON.stringify(userObj), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({
        success: true,
        message: 'Signed in with default administrator account',
        user: userObj,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
