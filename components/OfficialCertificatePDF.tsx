'use client';

import React, { useEffect, useState, useRef } from 'react';
import { generateQRCodeDataURL } from '@/lib/qrcode';
import { CertificateRecord } from '@/lib/certificateManager';

interface OfficialCertificatePDFProps {
  cert: CertificateRecord;
  className?: string;
  id?: string;
}

export default function OfficialCertificatePDF({ cert, className = '', id = 'certificate-print-area' }: OfficialCertificatePDFProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    async function loadQr() {
      if (cert?.verification_hash) {
        try {
          const url = await generateQRCodeDataURL(cert.verification_hash);
          setQrCodeUrl(url);
        } catch (e) {
          console.error('Failed to generate QR for PDF layout:', e);
        }
      }
    }
    loadQr();
  }, [cert?.verification_hash]);

  // Responsive scaling observer to scale fixed 1000px canvas to fit parent width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        if (parentWidth > 0) {
          // Fixed reference width for A4 landscape canvas is 1000px
          setScale(Math.min(1, parentWidth / 1000));
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // Extract certificate details with fallbacks matching exact sample image
  const certNumber = cert?.certificate_number || 'UAG-TC-22-REW-00746';
  const certificateRefCode = certNumber;
  const rawSalutation = cert?.salutation || 'Mr.';
  const candidateRawName = cert?.candidate?.full_name || 'SARDAR YADAV';

  // Format Candidate Display Name: Case-insensitively detect existing salutation (MR, MS, MRS, CAPT, ENG, DR)
  // Format salutation in Title Case ("Mr.", "Ms.", etc.) while displaying the candidate name in uppercase
  const salutationRegex = /^(mr|ms|mrs|capt|eng|dr)\.?\s+/i;

  const formatSalutation = (sal: string) => {
    if (!sal) return 'Mr.';
    const trimmed = sal.trim();
    const withDot = trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
    return withDot.charAt(0).toUpperCase() + withDot.slice(1).toLowerCase();
  };

  let displaySalutation = formatSalutation(rawSalutation);
  let displayName = candidateRawName.trim();

  const salutationMatch = candidateRawName.match(salutationRegex);
  if (salutationMatch) {
    displaySalutation = formatSalutation(salutationMatch[1]);
    displayName = candidateRawName.replace(salutationRegex, '').trim();
  }

  const passportNo = cert?.candidate?.passport_id || 'Y8774746';
  const courseTitle = cert?.course?.title || 'RATINGS FORMING PART OF AN ENGINEERING WATCH';

  // Regulation & Resolution Details
  const stcwRegulation = cert?.stcw_regulation || 'Regulation III/4, Section A-III/4, Table A-III/4 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended';
  const resolutionNo = cert?.resolution_number || 'DGGM-CFM-005-2024';
  const resolutionDateStr = cert?.resolution_date ? formatDate(cert.resolution_date) : 'February 06th, 2024';
  const resolutionExpiryStr = cert?.resolution_expiry ? formatDate(cert.resolution_expiry) : 'June 12th, 2026';

  // Dates & Locations
  const heldFromStr = cert?.held_from ? formatDate(cert.held_from) : 'April 11th, 2026';
  const heldToStr = cert?.held_to ? formatDate(cert.held_to) : 'April 24th, 2026';
  const courseMode = cert?.course_mode || 'Presential';
  const conductedAt = cert?.conducted_at || 'AZERBAIJAN';

  const issueDateStr = cert?.issue_date ? formatDate(cert.issue_date) : 'April 25th, 2026';
  const expiryDateStr = cert?.expiry_date ? formatDate(cert.expiry_date) : 'April 24th, 2031';

  const validityText = cert?.validity_years_text || '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)';
  const revisionCode = cert?.revision_code || 'REV. 2/2024';
  const numericHash = cert?.numeric_hash || (cert?.verification_hash ? extractNumericHash(cert.verification_hash) : '35637595039365');

  // Exact height for 1000px width with 1.4142857 aspect ratio (297mm / 210mm) is 707px
  const baseWidth = 1000;
  const baseHeight = 707;
  const scaledHeight = Math.round(baseHeight * scale);

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 297mm 210mm;
            margin: 0;
          }
          html, body {
            width: 297mm;
            height: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cert-outer-wrapper {
            aspect-ratio: auto !important;
            height: auto !important;
            overflow: visible !important;
            background: transparent !important;
          }
          .certificate-print-container {
            position: static !important;
            transform: none !important;
            width: 297mm !important;
            height: 210mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Outer Responsive Wrapper maintaining strict A4 Landscape Aspect Ratio */}
      <div
        ref={containerRef}
        className={`cert-outer-wrapper w-full aspect-[1.414/1] relative overflow-hidden bg-slate-200/60 rounded-2xl box-border ${className}`}
        style={{ height: scale < 1 ? `${scaledHeight}px` : undefined }}
      >
        {/* Certificate Fixed Canvas scaled smoothly */}
        <div
          id={id}
          className="certificate-print-container absolute top-0 left-0 bg-white text-black font-sans shadow-xl print:shadow-none box-border overflow-hidden"
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top left',
          }}
        >
          {/* Inner Scale Container to fit content within fixed A4 height without modifying custom margins */}
          <div className="w-full h-full transform scale-[0.96] origin-top flex flex-col box-border">
            {/* Outer Braided / Hatched Pattern Frame */}
            <div
              className="w-full h-full p-[5px] bg-white flex flex-col box-border overflow-hidden"
              style={{
                backgroundImage: 'repeating-linear-gradient(-45deg, #000000 0px, #000000 3.5px, #ffffff 3.5px, #ffffff 7px)',
              }}
            >
              <div className="bg-white p-[1.5px] flex-1 flex flex-col box-border overflow-hidden">
                {/* Inner Thin Black Rectangle Border Frame with strict padding */}
                <div className="border border-black p-4 relative bg-white flex-1 flex flex-col justify-between box-border overflow-hidden">

                  <div>
                    {/* Header Section Container */}
                    <div className="w-full relative px-2 pt-0.5 pb-1">

                      {/* Reference Code: Right-aligned ABOVE the top line */}
                      <div className="w-full text-right font-bold text-[12px] tracking-wider text-black pb-0.5 pr-1">
                        {certificateRefCode}
                      </div>

                      {/* TOP FULL-WIDTH BLUE LINE */}
                      <div className="w-full h-[2.5px] bg-[#0070C0]" />

                      {/* MIDDLE CONTENT: BOTH LOGOS AND MAIN TITLE (CONTAINED BETWEEN LINES) */}
                      <div className="w-full flex items-center justify-between py-1 px-2 my-0.5">

                        {/* Left Logo (CTC) - Fully inside top & bottom lines */}
                        <div className="w-26 h-22 flex items-center justify-center shrink-0">
                          <img
                            src="/images/ctc-logo.png"
                            alt="CTC Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        {/* Center Text Block */}
                        <div className="flex-1 text-center px-4">
                          <h1 className="text-[#0000FF] font-black text-[18px] tracking-wide uppercase italic leading-tight">
                            CONTINENTAL TRAINING CENTER S.A.
                          </h1>
                          <h2 className="text-[#0000FF] font-bold text-[14px] tracking-wider uppercase leading-tight mt-0.5">
                            UNITED ALLIANCE GROUP LTD
                          </h2>
                        </div>

                        {/* Right Logo (UAG Seal) - Fully inside top & bottom lines */}
                        <div className="w-26 h-22 flex items-center justify-center shrink-0">
                          <img
                            src="/images/uag-logo.png"
                            alt="UAG Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                      </div>

                      {/* BOTTOM FULL-WIDTH BLUE LINE */}
                      <div className="w-full h-[2.5px] bg-[#0070C0]" />

                      {/* ADDRESS AND CONTACT INFO (BELOW BOTTOM LINE) */}
                      <div className="w-full text-center mt-1 text-[11px] leading-[24px] font-bold text-black">
                        <p>PH BICSA Financial Center, Floor 44, Office No.4406, Balboa Avenue and Aquilino de la Guardia, Panama Rep. Of Panama</p>
                        <p className="font-bold">
                          E:mail: <span className="text-[#0070C0] underline font-medium">info@ctc.com.pa</span>, Web Page: www.ctc.com.pa
                        </p>
                      </div>

                    </div>

                    {/* Certificate Main Body */}
                    <div className="mt-2 max-w-4xl mx-auto text-center text-black leading-[24px]">

                      {/* Candidate Details & Course Title Block matching sample image */}
                      <div className="space-y-1.5 my-1">

                        {/* Certify that: */}
                        <p className="text-[14px] text-black">
                          Certify that:
                        </p>

                        {/* Candidate Full Name (Underlined: Salutation in Title Case, Name in Uppercase) */}
                        <p className="text-[14px] font-bold text-black font-sans tracking-wide">
                          <span className="inline-block border-b border-black pb-[1px] leading-tight">
                            {displaySalutation} <span className="uppercase">{displayName}</span>
                          </span>
                        </p>

                        {/* Passport Number */}
                        <p className="text-[11px] text-black tracking-wide leading-[24px]">
                          <span className="font-bold">Passport No:</span> <span className="inline-block border-b border-black pb-[1px] leading-tight">{passportNo}</span>
                        </p>

                        {/* Completion Statement */}
                        <p className="text-[14px] font-bold text-black pt-1">
                          Has successfully completed the training course
                        </p>

                        {/* Course Name */}
                        <p className="text-[16px] font-black text-black tracking-wider uppercase font-sans pt-0.5">
                          {courseTitle}
                        </p>

                      </div>

                      {/* Regulation & Approval Legal Statements */}
                      <div className="text-[13px] mt-2">

                        <p className="text-black font-normal">
                          The course fulfills minimum requirements of
                        </p>

                        <p className="font-bold text-black px-2 whitespace-pre-line leading-[23px]">
                          {stcwRegulation?.replace(/Training,\s*/, 'Training,\n')}
                        </p>

                        {/* Resolution & Dates Paragraph */}
                        <p className="text-black leading-[23px] font-normal mt-1">
                          This course has been approved by the Government of <span className="underline decoration-black">PANAMA</span>, by means of Resolution No. <span className="underline decoration-black">{resolutionNo}</span><br />
                          dated on <span className="underline decoration-black">{resolutionDateStr}</span> and Valid until <span className="underline decoration-black">{resolutionExpiryStr}</span>
                        </p>

                        {/* Held From / To / Mode / Location / Issue & Expiry Dates */}
                        <p className="text-black leading-[23px] font-normal mt-1">
                          <span className="font-bold">Held from</span> <span className="underline decoration-black">{heldFromStr}</span> <span className="font-bold">to</span> <span className="underline decoration-black">{heldToStr}</span> <span className="font-bold">Course Mode:</span> <span className="underline decoration-black">{courseMode}</span> <span className="font-bold">Conducted at</span> <span className="underline decoration-black">{conductedAt}</span><br />
                          <span className="font-bold">This certificate was issued on</span> <span className="underline decoration-black">{issueDateStr}</span>, <span className="font-bold">Valid until</span> <span className="underline decoration-black">{expiryDateStr}</span>
                        </p>

                        {/* Validity Banner Statement */}
                        <p className="text-[15px] leading-[23px] font-normal text-black underline decoration-black pt-2">
                          {validityText}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* Footer Section: Revision Code, Signature, QR Code */}
                  <div className="mt-2 pt-1 flex flex-row items-end justify-between gap-4 text-xs">

                    {/* Bottom Left: Revision Code */}
                    <div className="text-[11px] font-bold text-black text-left self-end pb-1 font-sans shrink-0 min-w-[120px]">
                      {revisionCode}
                    </div>

                    {/* Bottom Center: Official Signature Block */}
                    <div className="flex-1 shrink-0 text-center relative mx-auto flex flex-col items-center justify-end">
                      <div className="relative w-56 flex flex-col items-center">
                        {/* Signature Graphic positioned right above the black line */}
                        <img
                          src="/images/signature.png"
                          alt="CTC General Manager Signature"
                          crossOrigin="anonymous"
                          className="h-24 w-auto object-contain mix-blend-multiply -mb-10 translate-y-[-5px] z-10"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                        {/* Signature Horizontal Black Line */}
                        <div className="w-full border-b border-black" />
                        {/* Text below line */}
                        <div className="mt-0.5 text-center text-black font-bold leading-[24px]">
                          <p className="text-[13px]">Claudia Galeano</p>
                          <p className="text-[14px]">CTC General Manager</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Right: Digital Verification QR Code & Barcode Hash */}
                    <div className="flex flex-col items-center justify-center text-right shrink-0 min-w-[120px]">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Certificate Verification QR Code"
                          crossOrigin="anonymous"
                          className="w-20 h-20 object-contain p-0.5 bg-white"
                        />
                      ) : (
                        <div className="w-20 h-20 border border-black bg-slate-50 flex items-center justify-center font-mono text-[9px]">
                          QR CODE
                        </div>
                      )}

                      {/* Numeric Hash Printed Under QR Code */}
                      <span className="text-[11px] font-bold text-black mt-0.5 tracking-wider block font-sans">
                        {numericHash}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Format date into "Month DDth, YYYY" format matching sample certificate exactly
 */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[d.getUTCMonth()];
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${month} ${formattedDay}${suffix}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Extract numeric hash for bottom QR barcode text
 */
function extractNumericHash(hashStr: string): string {
  if (!hashStr) return '35637595039365';
  let digits = hashStr.replace(/\D/g, '');
  if (digits.length >= 14) return digits.slice(0, 14);

  // Pad with deterministic hash codes if needed
  let numeric = '';
  for (let i = 0; i < hashStr.length && numeric.length < 14; i++) {
    numeric += hashStr.charCodeAt(i).toString();
  }
  return (numeric + '35637595039365').slice(0, 14);
}



