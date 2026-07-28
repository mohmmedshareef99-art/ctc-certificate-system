'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';

export interface SlideItem {
  id: number;
  image: string;
  alt: string;
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 1,
    image: '/ctc-ship-banner.png',
    alt: 'Continental Training Center Panama'
  },
  {
    id: 2,
    image: '/ctc-simulator-banner.png',
    alt: 'Maritime Simulators'
  },
  {
    id: 3,
    image: '/courses/stcw-firefighting.png',
    alt: 'STCW Firefighting Training'
  },
  {
    id: 4,
    image: '/courses/stcw-survival.png',
    alt: 'STCW Survival Training'
  },
  {
    id: 5,
    image: '/courses/stcw-sso.png',
    alt: 'STCW Maritime Security'
  }
];

const AUTOPLAY_DURATION = 5000;

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / AUTOPLAY_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentSlide]);

  return (
    <section
      className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] overflow-hidden select-none bg-slate-950 border-b border-slate-200"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Images Carousel */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 z-10 pointer-events-auto'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-center"
          />

          {/* Subtle gradient overlay for button contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20" />
        </div>
      ))}

      {/* Progress Bar Top Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">
        <div
          className="h-full bg-[#0088CC] transition-all duration-75 ease-linear shadow-[0_0_8px_#0088CC]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Arrow - Left */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-[#0088CC] text-white backdrop-blur-md transition-all border border-white/20 hover:border-[#0088CC] hover:scale-110 shadow-xl focus:outline-none group cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Navigation Arrow - Right */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-[#0088CC] text-white backdrop-blur-md transition-all border border-white/20 hover:border-[#0088CC] hover:scale-110 shadow-xl focus:outline-none group cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Pause/Play Autoplay Indicator Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        className="absolute top-5 right-5 z-30 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md transition-all border border-white/15 text-xs flex items-center gap-1.5 px-3 cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-sky-400" />
        ) : (
          <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
        )}
      </button>

      {/* Slide Indicators (Dots) at Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlide
                ? 'w-8 h-2.5 bg-[#0088CC] shadow-[0_0_8px_#0088CC]'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
