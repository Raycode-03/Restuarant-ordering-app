import React from "react";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/Signupform";
import Image from "next/image";
import { AuthLoadingProvider } from "@/context/AuthLoadingContext";
export default function Page() {
  return (
    <AuthLoadingProvider>
    <div className="w-full min-h-screen flex">
      
      {/* Left: Form */}
      <div className="w-full md:w-1/2 relative ">
        

        {/* Centered form container */}
        <div className="w-full h-full flex items-center justify-center">
          <Card className="w-full max-w-sm border-none shadow-none">
            <SignUpForm />
          </Card>
        </div>
      </div>

      {/* Right: Image + Overlay (Desktop only) */}
     <div className="hidden md:block md:w-1/2 relative">
       {/* Background Image */}
       <Image
         src="/images/restaurant_image.jpg"
         alt="Login background"
         fill
         className="object-cover"
         priority
       />
     
       {/* Dark Overlay */}
       <div className="absolute inset-0 bg-black/60 z-0" />
     
       {/* Content */}
       <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center z-10">
         
         {/* Logo */}
         <Image
           src="/logos/svg.png"
           alt="Savory logo"
           width={320}
           height={320}
           className="mb-6 invert"
           priority
         />
     
         <h1 className="text-4xl font-bold mb-2">
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