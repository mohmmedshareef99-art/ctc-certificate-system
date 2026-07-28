'use client';

import React from 'react';
import { ShieldCheck, Lock, Globe, Building2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import CertificateSearch from '@/components/CertificateSearch';

export default function VerifyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 space-y-12">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Official Verification Portal
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#002B49]">
          Digital Certificate Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Verify the authenticity and validity of maritime training certificates and endorsements issued by Continental Training Center S.A. in Panama.
        </p>
      </div>

      {/* Main Search Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CertificateSearch compact={false} />
      </div>

      {/* Security & Authenticity Trust Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#0088CC] font-bold text-sm">
              <Lock className="w-5 h-5" />
              Cryptographic Security
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every certificate carries a unique, tamper-proof HASH code registered on our secure servers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Building2 className="w-5 h-5" />
              AMP Recognition
            </div>
            <p className="text-slate-600 leading-relaxed">
              Endorsements valid for Port State Control (PSC) inspections worldwide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Globe className="w-5 h-5" />
              24/7 Availability
            </div>
            <p className="text-slate-600 leading-relaxed">
              Instant real-time verification available 365 days a year for shipowners and port authorities.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
