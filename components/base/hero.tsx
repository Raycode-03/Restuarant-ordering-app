'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { homePage } from "@/lib/constants/landing";
import { useIsMobile } from '@/hooks/use-mobile';
import { useGsapFadeUp, useGsapFadeRight } from '@/hooks/useGsapAnimation';
const Hero = () => {
  const isMobile = useIsMobile();
  // refs
  const titleRef = useGsapFadeUp({ scroll: false, delay: 0 });
  const descRef = useGsapFadeUp({ scroll: false, delay: 0.2 });
  const btnRef = useGsapFadeUp({ scroll: false, delay: 0.4 });
  const imagesRef = useGsapFadeRight({ scroll: false, delay: 0.5 })
  return (
    <div className="relative mt-16 min-h-[70vh] lg:min-h-screen overflow-hidden">

  {/* Background image */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/images/hero-bg.jpg"
      alt="Restaurant background"
      fill
      className="object-cover"
      priority
    />
    {/* Dark overlay so text is readable */}
    <div className="absolute inset-0 bg-black/50" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
    <h1 ref={titleRef} className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
      Scan.<br />
      Order.<br />
      <span className="text-[#4ADE80]">Relax.</span>
    </h1>

    <p ref={descRef} className="mt-6 text-base lg:  text-xl text-white/80 leading-relaxed max-w-md mx-auto">
      {homePage.description}
    </p>

    <div ref={btnRef} className="mt-8 flex flex-col sm:flex-row gap-4">
      <Link href="/tables">
        <button className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-3.5 rounded-full transition-colors">
          {homePage.btn} →
        </button>
      </Link>
      <Link href="#about">
        <button className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-colors backdrop-blur-sm">
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <svg className="w-2.5 h-2.5 fill-black" viewBox="0 0 10 10">
              <polygon points="3,1 9,5 3,9" />
            </svg>
          </span>
          {homePage.getMore}
        </button>
      </Link>
    </div>
  </div>

  {/* Bottom fade */}
  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
</div>
  );
};

export default Hero;