"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuthLoading } from "./AuthLoadingContext";

const SignInWithGoogleButton = () => { 
   const { loadingType, setLoadingType } = useAuthLoading();
  const isLoading = loadingType === 'google';
  const isDisabled = loadingType !== null;


  const handleGoogleSignIn = async () => {
    setLoadingType('google');
    window.location.href = '/api/admin/google';  
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-83 p-4 flex items-center justify-center bg-black/30"
      onClick={handleGoogleSignIn}
      disabled={isDisabled}
    >
      <Image 
        src="/logos/google.svg" 
        alt="Google logo" 
        width={20} 
        height={20} 
        className="mr-2 inline-block"
      />
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
};

export default SignInWithGoogleButton;