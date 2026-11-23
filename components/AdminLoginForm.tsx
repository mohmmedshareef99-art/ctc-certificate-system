'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginAdmin, AdminUser } from '@/lib/adminAuthManager';

interface AdminLoginFormProps {
  onSuccess?: (user: AdminUser) => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        setSuccessMsg(res.message || 'Access granted! Redirecting...');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(res.user!);
            //throw new TypeError("Cannot read properties of undefined (reading 'renderLoginStream')  (src/components/AdminLoginForm.tsx:48:23)");
          } else {
            router.push('/admin');
            router.refresh();
          }
        }, 600);
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please check email & password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected error during credential verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#001D33] via-[#002B49] to-[#001524]">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0088CC] to-[#00E5FF] p-0.5 shadow-lg shadow-sky-500/20 mb-4">
            <div className="w-full h-full bg-[#002B49] rounded-[14px] flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-9 h-9" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/60 inline-block mb-2">
            Secure Admin Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Continental Training Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            STCW Certificate Management & Seafarers Registry
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ctc.com.pa"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-[#0088CC] hover:from-sky-400 hover:to-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Continental Training Center S.A. - Panama</p>
          <p className="text-[10px] text-slate-600 mt-1">Maritime Authority of Panama (AMP) - Certified Verification</p>
        </div>
      </div>
    </div>
  );
}
