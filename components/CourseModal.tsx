'use client';

import React from 'react';
import Image from 'next/image';
import { X, Clock, Award, ShieldCheck, Mail } from 'lucide-react';
import { Course } from '@/lib/coursesData';
import { useLanguage } from './LanguageContext';
import Link from 'next/link';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function CourseModal({ course, onClose }: CourseModalProps) {
  const { lang, t } = useLanguage();

  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Image */}
        <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
          <Image
            src={course.image}
            alt={course.title[lang]}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-[#0088CC] text-white font-mono text-xs font-bold">
                {course.code}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/90 text-white font-mono text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> AMP Approved
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black leading-tight drop-shadow">
              {course.title[lang]}
            </h2>
            <p className="text-xs text-sky-300 font-medium">
              {course.categoryLabel[lang]} &bull; {course.stcwRef}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0088CC]" /> {t('duration')}
            </span>
            <p className="font-bold text-slate-900 text-sm">{course.durationHours} {t('hours')} ({course.durationDays})</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[11px] block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" /> Accreditation
            </span>
            <p className="font-bold text-slate-900 text-sm">International Maritime Org. (IMO / STCW)</p>
          </div>
        </div>

        {/* Description & Prerequisites */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-xs border-l-2 border-[#0088CC] pl-2">
              Course Overview
            </h4>
            <p>{course.description[lang]}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-xs border-l-2 border-amber-500 pl-2">
              Prerequisites
            </h4>
            <p className="text-slate-600">{course.prerequisites[lang]}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <Link
            href={`/contact?course=${encodeURIComponent(course.code + ' - ' + course.title[lang])}`}
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#0088CC]/20 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Enroll / Contact Admissions
          </Link>
        </div>

      </div>
    </div>
  );
}
