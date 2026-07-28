import { createClient } from '@/lib/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'superadmin' | 'admin' | 'editor';
  created_at?: string;
  last_login?: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: AdminUser;
}

const LOCAL_ADMIN_SESSION_KEY = 'ctc_admin_session';

/**
 * Authenticate admin with email & password using /api/auth/login API Route.
 */
export async function loginAdmin(email: string, password: string): Promise<LoginResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, message: 'Please enter email address and password' };
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.user) {
      saveAdminSession(data.user);
      return { success: true, user: data.user, message: data.message || 'Signed in successfully' };
    }

    return { success: false, message: data.message || 'Invalid email or password' };
  } catch (err: any) {
    console.error('Error calling /api/auth/login:', err);
    return { success: false, message: err?.message || 'Network error during login.' };
  }
}

/**
 * Save logged-in admin user session locally in browser
 */
export function saveAdminSession(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving admin session:', e);
  }
}

/**
 * Get active admin session synchronously from localStorage
 */
export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionStr = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
  } catch (e) {
    console.error('Error reading admin session:', e);
  }
  return null;
}

/**
 * Check active session from server endpoint /api/auth/me
 */
export async function fetchAdminSession(): Promise<AdminUser | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        saveAdminSession(data.user);
        return data.user;
      }
    }
  } catch (e) {
    console.error('Error checking server session:', e);
  }
  return getAdminSession();
}

/**
 * Logout admin user by calling /api/auth/logout and clearing local state
 */
export async function logoutAdmin(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {
    console.error('Error calling logout route:', e);
  } finally {
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    document.cookie = 'ctc_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
