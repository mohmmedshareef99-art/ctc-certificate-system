'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, BookOpen } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import CourseCard from '@/components/CourseCard';
import CourseModal from '@/components/CourseModal';
import { COURSES_DATA, Course } from '@/lib/coursesData';

export default function CoursesPage() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = [
    { id: 'all', label: t('catAll') },
    { id: 'first-aid', label: t('catBasic') },
    { id: 'firefighting', label: t('catFire') },
    { id: 'security', label: t('catSecurity') },
    { id: 'survival', label: 'Survival (BST)' },
    { id: 'advanced', label: t('catAdvanced') }
  ];

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        course.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.stcwRef.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-white border border-sky-200 text-xs font-bold text-[#0088CC] uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            Official STCW Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#002B49]">
            Maritime Courses & AMP Endorsements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Complete directory of maritime training programs approved by the Maritime Authority of Panama (AMP) under the STCW 78/95 Convention with Manila Amendments.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, STCW code or standard..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#0088CC] text-white shadow-sm border border-[#0088CC]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Courses Count Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-2 font-medium">
          <span>Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of {COURSES_DATA.length} available courses</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> AMP Resolution Approved
          </span>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={(c) => setSelectedCourse(c)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center space-y-4 border border-slate-200 shadow-sm">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No courses found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Try adjusting your search query or select another category to see available STCW courses.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#0088CC] text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
