"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SignInWithGoogleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    window.location.href = '/api/admin/google';  // ✅ Correct path
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full p-4"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <Image 
        src="/logos/google.svg" 
        alt="Google logo" 
        width={20} 
        height={20} 
        className="mr-2 inline-block"
      />
      {loading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
};

export default SignInWithGoogleButton;