import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailPage() {
  return (
    <div className="w-full min-h-screen flex">
      
      {/* Left: Verification Message */}
      <div className="w-full md:w-1/2 relative bg-background">
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

        {/* Centered content */}
        <div className="w-full h-full flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-none shadow-none">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold">Check your email</CardTitle>
              <CardDescription className="text-base">
                We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-700">What to do next:</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to log in</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <Link 
                    href="/contact" 
                    className="text-blue-600 hover:underline"
                >
                    contact support
                </Link>.
                </p>


              <div className="pt-4">
                <Link href="/admin/login">
                  <Button className="w-full bg-blue-600" variant="default">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Image + Overlay (Desktop only) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/restaurant_image.jpg"
          alt="Verify email background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Almost there!
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Just one more step to get started with Savory.
          </p>
        </div>
      </div>
    </div>
  );
}