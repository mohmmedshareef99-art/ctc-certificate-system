'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Printer,
  XCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { getCertificateByHash, CertificateRecord } from '@/lib/certificateManager';
import { downloadCertificatePDF } from '@/lib/pdfExport';
import OfficialCertificatePDF from '@/components/OfficialCertificatePDF';

interface CertificateViewPageProps {
  params: Promise<{ hash: string }>;
}

function CertificateViewContent({ params }: CertificateViewPageProps) {
  const resolvedParams = use(params);
  const hash = resolvedParams.hash;
  const searchParams = useSearchParams();

  // Hide Print and Download buttons on public verification view by default.
  // Allow action buttons ONLY when accessed with explicit admin parameters (?admin=true, ?showActions=true, or ?mode=admin).
  const showActions =
    searchParams.get('admin') === 'true' ||
    searchParams.get('showActions') === 'true' ||
    searchParams.get('mode') === 'admin';

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificateRecord | null>(null);

  useEffect(() => {
    async function loadCertificate() {
      setLoading(true);
      if (!hash) {
        setLoading(false);
        return;
      }

      try {
        const found = await getCertificateByHash(hash);
        setCert(found);
      } catch (err) {
        console.error('Error fetching certificate for view route:', err);
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

  const handleDownloadPDF = async () => {
    if (cert) {
      await downloadCertificatePDF('verify-certificate-export', cert.certificate_number || 'Certificate');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-3 sm:pt-6 px-2 sm:px-6 md:px-8 pb-8 bg-slate-900 text-slate-100 print:p-0 print:bg-white print:block">

      {/* Top Toolbar (Hidden when printing) */}
      <div className="max-w-5xl w-full mb-4 sm:mb-6 print:hidden bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-700 shadow-xl flex flex-row items-center justify-between gap-2 sm:gap-4">
        {/* <Link
          href={`/verify/${hash}`}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Return to QR Validity Query</span>
        </Link> */}

        {cert && !isRevoked && (
          showActions ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrint}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 sm:gap-2 border border-slate-600 cursor-pointer transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Print Certificate</span>
                <span className="sm:hidden">Print</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0088CC] to-[#0066AA] hover:from-[#0077BB] hover:to-[#005599] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0088CC]/30 flex items-center gap-1.5 sm:gap-2 border border-sky-400/30 cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium bg-slate-700/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-600/50 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Official View</span>
            </div>
          )
        )}
      </div>

      {loading ? (
        <div className="max-w-5xl w-full mx-auto p-12 bg-slate-800 rounded-3xl border border-slate-700 text-center space-y-4 print:hidden">
          <div className="w-12 h-12 border-4 border-[#0088CC] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-300 font-medium">Loading official certificate document...</p>
        </div>
      ) : isRevoked ? (
        <div className="max-w-2xl w-full mx-auto p-8 bg-red-900/30 border-2 border-red-500 rounded-3xl text-center space-y-4 print:hidden">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white uppercase">Certificate Revoked</h2>
          <p className="text-xs text-red-200 leading-relaxed">
            This certificate record has been revoked or invalidated. The document viewer is unavailable.
          </p>
          <div className="pt-2">
            <Link
              href={`/verify/${hash}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Query Status
            </Link>
          </div>
        </div>
      ) : cert ? (
        <div className="w-full max-w-5xl mx-auto print:max-w-none print:w-full print:m-0 print:p-0">
          <div className="w-full overflow-x-auto p-1 sm:p-4 bg-white rounded-xl shadow-2xl border border-slate-700 print:bg-transparent print:border-none print:shadow-none print:p-0 print:rounded-none">
            {/* Pixel-perfect official A4 Landscape certificate template */}
            <OfficialCertificatePDF cert={cert} id="verify-certificate-export" />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto p-8 bg-slate-800 rounded-3xl border border-slate-700 text-center space-y-4 print:hidden">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Certificate Not Found</h2>
          <p className="text-xs text-slate-400">
            No record found for hash <code className="font-mono text-amber-300">{hash}</code>.
          </p>
          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Verification Portal
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CertificateViewPage(props: CertificateViewPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="w-10 h-10 border-4 border-[#0088CC] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CertificateViewContent {...props} />
    </Suspense>
  );
}

