'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ShieldCheck, ArrowRight, Anchor, Flame, HeartPulse, Lock, Compass, Stethoscope } from 'lucide-react';
import { Course } from '@/lib/coursesData';
import { useLanguage } from './LanguageContext';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  const { lang, t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'Stethoscope': return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'Lock': return <Lock className="w-4 h-4 text-amber-500" />;
      case 'Compass': return <Compass className="w-4 h-4 text-indigo-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-[#0088CC]" />;
      default: return <Anchor className="w-4 h-4 text-[#0088CC]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between relative group border border-slate-200 hover:border-[#0088CC]/60 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={course.image}
          alt={course.title[lang]}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Gradient Overlay for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-white/40 shadow-sm text-xs font-bold text-slate-800">
            {getIcon(course.icon)}
            <span>{course.categoryLabel[lang]}</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#0088CC] text-white font-mono text-xs font-bold shadow-md">
            {course.code}
          </span>
        </div>

        {/* STCW Spec Tag at bottom left of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded bg-slate-900/80 text-sky-300 font-mono text-[11px] font-semibold backdrop-blur-sm border border-sky-400/30">
            {course.stcwRef}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0088CC] transition-colors leading-snug line-clamp-2">
            {course.title[lang]}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {course.description[lang]}
          </p>
        </div>

        {/* Meta Specs & Action Button */}
        <div className="space-y-3 pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Clock className="w-4 h-4 text-[#0088CC]" />
              {course.durationHours} {t('hours')}
            </span>
            <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> AMP Approved
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onSelect(course)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0088CC] text-slate-800 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-200 hover:border-[#0088CC] flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
          >
            <span>{t('details')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0088CC] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
