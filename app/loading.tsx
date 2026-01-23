"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function Loading() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <main className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* Glow */}
        <div className="absolute inset-0 blur-2xl opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse" />
        </div>

        
        <Image
          src="/logos/svg.png"
          alt="Loading"
          fill
          unoptimized 
          className="object-contain invert animate-float"
        />
      </div>
    </main>
  );
}

export default Loading;