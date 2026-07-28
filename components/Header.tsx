'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import CTCLogo from '@/components/logos/CTCLogo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/about', label: t('navAbout') },
    { href: '/courses', label: t('navCourses') },
    { href: '/verify', label: t('navVerify') },
    { href: '/admin', label: 'Admin Portal' },
    { href: '/contact', label: t('navContact') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#002B49] text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-200">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Autoridad Marítima de Panamá (AMP) Accredited Center
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-slate-300 text-[11px]">
            <span>Tel: +507 269-0123 / +507 300-4567</span>
            <span className="text-sky-300 font-sans font-medium">info@ctc.com.pa</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo (CTC) */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex items-center transition-transform group-hover:scale-105">
            <CTCLogo size={52} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-wider text-[#002B49]">CTC</span>
              <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md bg-sky-100 text-[#0088CC] border border-sky-200 uppercase">
                Panamá
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-600 font-bold tracking-wide uppercase">
              Continental Training Center S.A.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors py-1 border-b-2 ${
                isActive(link.href)
                  ? 'border-[#0088CC] text-[#002B49] font-bold'
                  : 'border-transparent text-slate-600 hover:text-[#0088CC] hover:border-sky-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick Certificate Verify CTA */}
          <Link
            href="/verify"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#0088CC] hover:bg-[#0077BB] text-white transition-all shadow-md shadow-[#0088CC]/20 border border-sky-400/30 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            {t('verifyButton')}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#002B49]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-sky-50 text-[#0088CC] font-bold border border-sky-200'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#002B49]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-lg bg-[#0088CC] text-white flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t('verifyButton')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
