import React from "react";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/Signupform";
import Image from "next/image";
import { AuthLoadingProvider } from "@/components/auth/AuthLoadingContext";
export default function Page() {
  return (
    <AuthLoadingProvider>
    <div className="w-full min-h-screen flex">
      
      {/* Left: Form */}
      <div className="w-full md:w-1/2 relative ">
        {/* Logo - fixed at top-left corner */}
        <div className="absolute -top-12 left-6 z-10">
          <Image
            src="/logos/svg.png"
            alt="Savory logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* Centered form container */}
        <div className="w-full h-full flex items-center justify-center">
          <Card className="w-full max-w-sm border-none shadow-none">
            <SignUpForm />
          </Card>
        </div>
      </div>

      {/* Right: Image + Overlay (Desktop only) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/restaurant_image.jpg"
          alt="Signup background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">
          <h1 className="text-5xl font-bold mb-2">
            Welcome to Savory
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Manage your restaurant, orders, and customers all in one place.
          </p>
        </div>
      </div>
    </div>
    </AuthLoadingProvider>
  );
}