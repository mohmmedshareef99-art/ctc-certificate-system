'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  Building2,
  Globe,
  Compass,
  Users,
  Check
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import CourseCard from '@/components/CourseCard';
import CourseModal from '@/components/CourseModal';
import HeroCarousel from '@/components/HeroCarousel';
import { COURSES_DATA, Course } from '@/lib/coursesData';

export default function Home() {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const featuredCourses = COURSES_DATA.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#0088CC] selection:text-white">
      {/* 1. HERO SLIDER BANNER CAROUSEL SECTION */}
      <HeroCarousel />

      {/* 2. ACCREDITATION & MARITIME AUTHORITY BANNER */}
      <section id="amp" className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
              <div className="p-3 rounded-lg bg-sky-100 text-[#0088CC]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#002B49] uppercase tracking-wider">Maritime Authority of Panama</h4>
                <p className="text-xs text-slate-600 mt-0.5">DGGM approval under STCW 78/95 Manila Amendments</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#002B49] uppercase tracking-wider">ISO 9001:2015 Certified</h4>
                <p className="text-xs text-slate-600 mt-0.5">Quality Management System for Maritime Training</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm">
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#002B49] uppercase tracking-wider">International Recognition</h4>
                <p className="text-xs text-slate-600 mt-0.5">Valid for seafarer deployment on Panamanian & global flag vessels</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED STCW COURSES GRID */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088CC] block mb-2">
                Certified Training
              </span>
              <h2 className="text-3xl font-black text-[#002B49] tracking-tight">
                {t('featuredCourses')}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {t('featuredSub')}
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#0088CC] text-[#0088CC] hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-sky-200 shadow-sm"
            >
              <span>{t('viewAllCourses')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={(c) => setSelectedCourse(c)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHY CTC PANAMA & SIMULATOR LABS */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0088CC]">
                State-of-the-Art Maritime Infrastructure
              </span>
              <h2 className="text-3xl font-black text-[#002B49] leading-tight">
                Advanced Simulators & Training Grounds in Panama
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Continental Training Center S.A. provides technical facilities equipped with cutting-edge technology for training officers and crew members of merchant ships, cruise liners, and offshore vessels.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '360° Navigation Bridge Simulator (Bridge Resource Management)',
                  'Full-Scale Firefighting Practice Grounds',
                  'Engine Room Simulator (ERS)',
                  'Personal Survival & Lifeboat Launching Pool',
                  'AMP Certified Instructors with Extensive Maritime Experience'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-slate-700 font-medium">
                    <div className="p-1 rounded bg-sky-100 text-[#0088CC] mt-0.5 border border-sky-200">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002B49] hover:bg-[#001C30] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Building2 className="w-4 h-4 text-sky-400" />
                  Explore Our Facilities
                </Link>
              </div>
            </div>

            {/* Stats Graphic Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-[#002B49] bg-[#002B49] text-white shadow-lg space-y-2">
                <Users className="w-8 h-8 text-sky-400" />
                <h3 className="text-3xl font-black text-white">25,000+</h3>
                <p className="text-xs text-slate-300">Internationally Certified Seafarers</p>
              </div>

              <div className="p-6 rounded-2xl border border-amber-600 bg-amber-500 text-white shadow-lg space-y-2">
                <Award className="w-8 h-8 text-amber-100" />
                <h3 className="text-3xl font-black text-white">50+</h3>
                <p className="text-xs text-amber-100">AMP Approved STCW Courses</p>
              </div>

              <div className="p-6 rounded-2xl border border-emerald-700 bg-emerald-800 text-white shadow-lg space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-300" />
                <h3 className="text-3xl font-black text-white">100%</h3>
                <p className="text-xs text-emerald-100">Digital Verification Online</p>
              </div>

              <div className="p-6 rounded-2xl border border-[#001C30] bg-[#001C30] text-white shadow-lg space-y-2">
                <Compass className="w-8 h-8 text-sky-400" />
                <h3 className="text-3xl font-black text-white">15+</h3>
                <p className="text-xs text-slate-300">Years of Maritime Excellence</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      {/* <section className="py-16 bg-gradient-to-r from-[#002B49] via-[#003B63] to-[#002B49] border-t border-slate-200 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Need to Endorse or Enroll in an STCW Course in Panama?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Our maritime admissions team is ready to assist you with scheduling individual or group courses for shipping companies.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#0088CC] hover:bg-[#0077BB] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#0088CC]/30 transition-all"
            >
              Contact Us Today
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition-all backdrop-blur-sm"
            >
              Browse Course Catalog
            </Link>
          </div>
        </div>
      </section> */}

      {/* Course Modal */}
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
