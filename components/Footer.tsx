'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import CTCLogo from '@/components/logos/CTCLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="ctc-footer-bg text-slate-300 border-t border-[#0088CC]/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & About Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <CTCLogo size={56} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">CTC <span className="text-sky-400">Panama</span></span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Continental Training Center S.A.</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerAccreditation')} World-class maritime training authorized for seafarers globally under IMO and AMP Panama regulations.
            </p>
            
            {/* Accreditation Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-2">Accreditations & Certifications</span>
              <div className="flex flex-wrap gap-2">
                <div className="px-2.5 py-1 rounded bg-[#002B49] border border-[#0088CC]/30 text-[10px] font-mono text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0088CC]" />
                  AMP Maritime Authority
                </div>
                <div className="px-2.5 py-1 rounded bg-[#002B49] border border-[#0088CC]/30 text-[10px] font-mono text-slate-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  ISO 9001:2015
                </div>
                <div className="px-2.5 py-1 rounded bg-[#002B49] border border-[#0088CC]/30 text-[10px] font-mono text-slate-200 flex items-center gap-1">
                  STCW 1978 Manila
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#0088CC] pl-2.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navCourses')}
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navVerify')}
                </Link>
              </li>
              <li>
                <Link href="/about#amp" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navAMP')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-[#0088CC]">&rsaquo;</span> {t('navContact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#0088CC] pl-2.5">
              Headquarters / Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#0088CC] shrink-0 mt-0.5" />
                <span>PH BICSA Financial Center, Floor 44, Office No.4406, Balboa Avenue and Aquilino de la Guardia, Panama Rep. Of Panama</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#0088CC] shrink-0" />
                <span>+507 269-0123 / +507 300-4567</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#0088CC] shrink-0" />
                <span>info@ctc.com.pa</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#0088CC] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight text-slate-400">{t('hoursVal')}</span>
              </div>
            </div>
          </div>

          {/* Maritime Approvals / AMP Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#0088CC] pl-2.5">
              Maritime Endorsements
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continental Training Center S.A. & United Alliance Group Ltd strictly comply with international IMO conventions and General Directorate of Seafarers regulations (DGGM - AMP).
            </p>
            <div className="p-3 rounded-lg bg-[#001C30] border border-[#0088CC]/20 text-xs">
              <span className="text-sky-400 font-semibold block mb-1">Online Verification</span>
              <p className="text-[11px] text-slate-400">
                Verify the authenticity of any certificate by entering the query code or scanning the official QR code.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-1 text-[11px] text-[#0088CC] hover:text-sky-300 font-bold mt-2"
              >
                Go to Verification Portal &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Continental Training Center S.A. & United Alliance Group Ltd. {t('footerRights')}
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">Republic of Panama</span>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-slate-300">Terms & Conditions</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-slate-300">Technical Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
