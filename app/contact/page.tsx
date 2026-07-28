'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Navigation, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get('course');
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: courseParam ? `Enrollment: ${courseParam}` : '',
    message: courseParam ? `I would like to request information and enrollment for the course: ${courseParam}` : '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (courseParam) {
      setFormData((prev) => ({
        ...prev,
        subject: `Enrollment: ${courseParam}`,
        message: `I would like to request information and enrollment for the course: ${courseParam}`,
      }));
    }
  }, [courseParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
      <h2 className="text-xl font-bold text-[#002B49] mb-6 border-l-4 border-[#0088CC] pl-3">
        Contact Form
      </h2>

      {status === 'success' ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h3>
          <p className="text-xs text-slate-600">
            {t('msgSent')} An admissions representative from Continental Training Center S.A. will respond shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t('nameLabel')} *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="First and Last Name"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t('emailLabel')} *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+507 6000-0000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t('subjectLabel')}</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Inquiry about STCW course / Endorsement / Verification"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t('messageLabel')} *</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your inquiry or enrollment details..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0088CC] font-medium"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 bg-[#0088CC] hover:bg-[#0077BB] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0088CC]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {status === 'submitting' ? 'Sending...' : t('sendButton')}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 space-y-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-xs font-bold text-[#0088CC] uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
          <Phone className="w-3.5 h-3.5" />
          Customer Care & Admissions
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#002B49]">
          {t('contactHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {t('contactSub')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Form */}
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading contact form...</div>}>
            <ContactFormInner />
          </Suspense>

          {/* Right Column: Office Info & Google Maps Placeholder */}
          <div className="space-y-6">
            
            {/* Contact Details Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-base font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0088CC]" />
                Continental Training Center S.A.
              </h3>

              <div className="space-y-3 text-slate-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0088CC] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Physical Address:</strong>
                    <span>{t('panamaAddress')}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#0088CC] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Main Phone Lines:</strong>
                    <span>+507 269-0123 / +507 300-4567</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#0088CC] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Official Email:</strong>
                    <span>info@ctc.com.pa</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#0088CC] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Admissions Working Hours:</strong>
                    <span>{t('hoursVal')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Container Placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 shadow-md group">
              {/* Map Graphic Preview */}
              <div className="absolute inset-0 bg-slate-200 bg-[radial-gradient(#0088CC_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
                <div className="p-3 rounded-full bg-sky-100 text-[#0088CC] border border-sky-300 animate-bounce">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#002B49]">Panama City &bull; Canal Area</h4>
                  <p className="text-xs text-slate-600">Coordinates: 8.9824° N, 79.5199° W</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Panama+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0088CC] hover:bg-[#0077BB] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Google Maps
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
