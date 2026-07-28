'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Building2, Anchor, CheckCircle2, Target, Eye } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 space-y-16">
      
      {/* 1. Hero Header */}
      <section className="relative py-16 bg-[#002B49] text-white overflow-hidden -mt-16 mb-12">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/ctc-ship-banner.png"
            alt="CTC Panama Vessel"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#002B49] via-[#002B49]/80 to-transparent z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-300 uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
            <Anchor className="w-3.5 h-3.5 text-sky-400" />
            Institutional Profile
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Continental Training Center <span className="text-sky-400">S.A.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
            Leaders in maritime training, STCW certification, and official seafarer endorsements under the supervision of the Maritime Authority of Panama (AMP).
          </p>
        </div>
      </section>

      {/* 2. Company Profile & Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#002B49] leading-tight">
              History & Commitment to Seafarers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Continental Training Center S.A. (CTC Panama) is a world-class maritime training institute established in the Republic of Panama. We are dedicated to training deck, engine, and security personnel according to the highest standards mandated by the International Maritime Organization (IMO).
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our instructional programs combine academic rigor, real-time simulation, and hands-on field training at our approved facilities authorized by the General Directorate of Seafarers (DGGM - AMP).
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-[#0088CC] font-mono">100%</span>
                <p className="text-xs text-slate-700 mt-1 font-semibold">STCW Convention Compliant</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-amber-600 font-mono">ISO 9001</span>
                <p className="text-xs text-slate-700 mt-1 font-semibold">Quality Management System</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-md space-y-6">
            <h3 className="text-xl font-bold text-[#002B49] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#0088CC]" />
              Institutional Values
            </h3>
            
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-sky-100 text-[#0088CC] mt-0.5 border border-sky-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002B49]">Academic & Maritime Excellence</h4>
                  <p className="text-slate-600">Instructors certified as Master Mariners and Chief Engineers with extensive international sea service.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-sky-100 text-[#0088CC] mt-0.5 border border-sky-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002B49]">Safety of Life at Sea (SOLAS)</h4>
                  <p className="text-slate-600">Absolute priority in survival training, firefighting tactics, and medical first response.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-sky-100 text-[#0088CC] mt-0.5 border border-sky-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#002B49]">Integrity & Digital Transparency</h4>
                  <p className="text-slate-600">Instant digital verification of certificates for port state control authorities and shipowners.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 shadow-sm">
              <div className="p-3 rounded-xl bg-sky-100 text-[#0088CC] w-fit border border-sky-200">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#002B49]">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To deliver comprehensive, timely technical training to seafarers, promoting advanced practical competencies in strict compliance with the regulations of the Maritime Authority of Panama and international IMO conventions, safeguarding lives and protecting the marine environment.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 shadow-sm">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700 w-fit border border-amber-200">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#002B49]">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To consolidate our position as the benchmark maritime training center in Latin America and the Caribbean, recognized for the excellence of its navigation simulators, seamless seafarer endorsement management, and professional caliber of its graduates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. AMP Approvals Section */}
      <section id="amp" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0088CC]">
            Official Regulatory Framework
          </span>
          <h2 className="text-3xl font-black text-[#002B49]">
            Maritime Authority of Panama (AMP) Approvals
          </h2>
          <p className="text-xs text-slate-600">
            Active resolutions issued by the General Directorate of Seafarers (DGGM).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#0088CC]" />
            <h4 className="text-base font-bold text-[#002B49]">Resolution DGGM-RES-2023-4819</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official authorization for conducting STCW VI/1 (Basic), VI/2, VI/3, VI/4, VI/5, and VI/6 courses for national and international seafarers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <Award className="w-8 h-8 text-amber-600" />
            <h4 className="text-base font-bold text-[#002B49]">ISO 9001:2015 Certification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              External audit quality certificate covering pedagogical processes, assessment infrastructure, and lifesaving equipment inspection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <Building2 className="w-8 h-8 text-emerald-600" />
            <h4 className="text-base font-bold text-[#002B49]">Facility Registry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspected physical facilities approved for fire simulation, vessel abandonment practices, and medical first-aid laboratories.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#0088CC]/20 transition-all"
        >
          Explore Approved Courses &rarr;
        </Link>
      </section>
    </div>
  );
}
