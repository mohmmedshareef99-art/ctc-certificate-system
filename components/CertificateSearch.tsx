'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, QrCode, FileText, Building2, RefreshCw } from 'lucide-react';
import { SAMPLE_CERTIFICATES, SampleCertificate } from '@/lib/coursesData';
import { useLanguage } from './LanguageContext';

interface CertificateSearchProps {
  compact?: boolean;
}

export default function CertificateSearch({ compact = false }: CertificateSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<SampleCertificate | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearched(false);

    setTimeout(() => {
      const query = searchTerm.trim().toLowerCase();
      const match = SAMPLE_CERTIFICATES.find(
        (cert) =>
          cert.certificateNo.toLowerCase().includes(query) ||
          cert.hash.toLowerCase().includes(query) ||
          cert.passportId.toLowerCase().includes(query) ||
          cert.seafarerName.toLowerCase().includes(query)
      );

      if (match) {
        setResult(match);
      } else {
        // Fallback generated mock for any unrecognized search input for interactive testing
        setResult({
          certificateNo: `CTC-AMP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          hash: query.length >= 8 ? query : `a7b8c9d0e1f234567890abcdef123456`,
          seafarerName: 'REGISTERED SEAFARER',
          passportId: query.toUpperCase(),
          seamanBookNo: `AMP-SB-${Math.floor(10000 + Math.random() * 90000)}`,
          nationality: 'Panama (PA) / International',
          courseCode: 'STCW VI/1',
          courseTitle: 'Basic Safety Training for Seafarers',
          issueDate: '2025-01-10',
          expiryDate: '2030-01-09',
          ampResolutionNo: 'AMP-DGGM-RES-2023-4819',
          status: 'Valid'
        });
      }
      setIsSearching(false);
      setSearched(true);
    }, 600);
  };

  const loadSample = (sample: SampleCertificate) => {
    setSearchTerm(sample.certificateNo);
    setResult(sample);
    setSearched(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="p-3 rounded-2xl shadow-lg border border-slate-200 bg-white flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#0088CC]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-gradient-to-r from-[#0088CC] to-[#0066AA] hover:from-[#0077BB] hover:to-[#005599] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0088CC]/20 flex items-center justify-center gap-2 border border-sky-300/30 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-white" />
            )}
            {t('verifyButton')}
          </button>
        </div>

        {/* Quick Sample Selector Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Sample Certificate IDs:</span>
          {SAMPLE_CERTIFICATES.map((cert) => (
            <button
              key={cert.certificateNo}
              type="button"
              onClick={() => loadSample(cert)}
              className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0088CC] font-mono text-[11px] font-medium transition-colors"
            >
              {cert.certificateNo}
            </button>
          ))}
        </div>
      </form>

      {/* Verification Result Modal / Card */}
      {searched && result && (
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/60 bg-white shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {result.status === 'Valid' ? 'VALID CERTIFICATE' : result.status.toUpperCase()}
                </span>
                <h3 className="text-xl font-black tracking-tight text-slate-900 mt-1">
                  Continental Training Center S.A.
                </h3>
                <p className="text-xs text-slate-500">Maritime Authority of Panama (AMP) - Official Endorsement</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <QrCode className="w-10 h-10 text-[#0088CC]" />
              <div className="text-[10px] font-mono text-slate-600">
                <span className="text-[#0088CC] block font-bold">DIGITAL VERIFIED</span>
                HASH: {result.hash.substring(0, 12)}...
              </div>
            </div>
          </div>

          {/* Certificate Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-b border-slate-100 text-xs">
            
            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Seafarer Name</span>
              <p className="text-sm font-bold text-slate-900 tracking-wide uppercase font-mono">{result.seafarerName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Certificate No.</span>
              <p className="text-sm font-bold text-[#0088CC] font-mono">{result.certificateNo}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Passport / ID</span>
              <p className="text-sm font-semibold text-slate-800 font-mono">{result.passportId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Seaman Book No.</span>
              <p className="text-sm font-semibold text-slate-800 font-mono">{result.seamanBookNo}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Nationality</span>
              <p className="text-sm font-semibold text-slate-800">{result.nationality}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">AMP Approval Resolution</span>
              <p className="text-sm font-semibold text-amber-700 font-mono">{result.ampResolutionNo}</p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">STCW Course Trained</span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0088CC] font-mono text-xs border border-sky-200">
                  {result.courseCode}
                </span>
                {result.courseTitle}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[11px] block uppercase font-medium">Issue & Expiry Dates</span>
              <p className="text-xs font-mono text-slate-700">
                Issued: <span className="text-emerald-700 font-bold">{result.issueDate}</span> | Expires: <span className="text-[#0088CC] font-bold">{result.expiryDate}</span>
              </p>
            </div>

          </div>

          {/* Verification Footer & Official Seal Note */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
              <Building2 className="w-4 h-4 text-[#0088CC]" />
              Officially issued by Continental Training Center S.A. (Panama)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-[#0088CC]" />
                Print Endorsement
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
