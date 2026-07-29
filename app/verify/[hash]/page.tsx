'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  ArrowLeft, 
  Search, 
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getCertificateByHash, CertificateRecord } from '@/lib/certificateManager';

interface VerifyHashPageProps {
  params: Promise<{ hash: string }>;
}

export default function VerifyHashPage({ params }: VerifyHashPageProps) {
  // Unwrap Next 15/16 params Promise
  const resolvedParams = use(params);
  const hash = resolvedParams.hash;

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCertificate() {
      setLoading(true);
      const cleanHash = hash ? hash.trim() : '';
      if (!cleanHash) {
        setLoading(false);
        return;
      }

      try {
        const found = await getCertificateByHash(cleanHash);
        if (!found) {
          console.warn(`[VERIFICATION AUDIT] Certificate record not found for scanned hash: "${cleanHash}" (raw parameter: "${hash}")`);
        }
        setCert(found);
      } catch (err) {
        console.error('Error fetching certificate:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificate();
  }, [hash]);

  const isRevoked = 
    cert?.status?.toUpperCase() === 'REVOKED' || 
    cert?.status?.toUpperCase() === 'INVALID' ||
    cert?.status?.toUpperCase().includes('REVOKED') ||
    cert?.status?.toUpperCase().includes('INVALID');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return dateStr.split('T')[0];
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0088CC] hover:text-[#0066AA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Verification Portal
        </Link>
      </div>

      {loading ? (
        <div className="w-full max-w-3xl p-12 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#0088CC] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Verifying QR query credentials...</p>
        </div>
      ) : cert ? (
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Header Section: Logo + QR Validity Query Address Block */}
          <div className="flex items-start gap-4">
            <img
              src="/images/ctc-logo.png"
              alt="Continental Training Center S.A"
              className="w-14 sm:w-16 h-auto object-contain shrink-0"
            />
            
            <div className="space-y-1 text-left">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#111827] leading-tight">
                QR Validity Query
              </h1>
              <div className="text-xs sm:text-sm text-slate-800 font-medium leading-snug space-y-0.5">
                <p className="font-bold text-slate-900">Continental Training Center S.A</p>
                <p>PH BICSA Financial Center Floor N.44,</p>
                <p>Office No.4406 Ave. Balboa and Aquilino</p>
                <p>De la Guardia Street</p>
                <p>Panama City, Republic of Panama</p>
                <p className="pt-0.5">
                  <span className="font-bold text-slate-900">Email: </span>
                  <a 
                    href="mailto:info@ctc.com.pa" 
                    className="text-sky-500 hover:underline"
                  >
                    info@ctc.com.pa
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Revocation Warning (High Priority Override) */}
          {isRevoked && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-5 text-red-900 shadow-sm flex items-start sm:items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg shrink-0">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-red-700">
                  THIS CERTIFICATE HAS BEEN REVOKED / INVALIDATED
                </h2>
                <p className="text-xs text-red-600 font-medium leading-relaxed">
                  This record is no longer valid. Verification and download access are restricted by Continental Training Center S.A.
                </p>
              </div>
            </div>
          )}

          {/* Horizontal Divider Line */}
          <hr className="border-t border-slate-200 my-4" />

          {/* Key-Value Field Mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Number Certificate
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {cert.certificate_number}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Participant
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1 uppercase">
                {cert.candidate?.full_name ? cert.candidate.full_name.toUpperCase() : 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Identity
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {cert.candidate?.identity_number || cert.candidate?.passport_id || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Nacionality
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1 uppercase">
                {cert.candidate?.nationality ? cert.candidate.nationality.toUpperCase() : 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Issue Date
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {formatDate(cert.issue_date)}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Due Date
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {formatDate(cert.expiry_date)}
              </span>
            </div>
          </div>

          {/* Primary Action Button Section */}
          <div className="pt-6 flex justify-center sm:justify-start">
            {!isRevoked ? (
              <Link
                href={`/verify/${hash}/view`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-700" />
                <span>VIEW CERTIFICATE</span>
              </Link>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm border border-slate-200 cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>VIEW CERTIFICATE (REVOKED)</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Warning State for Invalid / Not Found Hash */
        <div className="w-full max-w-2xl p-8 sm:p-10 bg-white rounded-2xl border-2 border-rose-300 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 border border-rose-200 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs uppercase tracking-widest inline-block">
              Certificate Not Found / Invalid Hash
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              No valid certificate found for this HASH
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              The verification code <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-rose-700 font-bold">{hash}</code> does not match any issuance record at Continental Training Center S.A.
            </p>
          </div>

          {/* Quick Lookup Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-slate-700 block text-left">
              Try searching by certificate number or HASH:
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/verify/${searchQuery.trim()}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. UAG-TC-26-RNW-00888 or hash code..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0088CC]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0088CC] hover:bg-[#0077BB] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
