"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuthLoading } from "./AuthLoadingContext";

const SignInWithGithubButton = () => {
     const { loadingType, setLoadingType } = useAuthLoading();
  const isLoading = loadingType === 'github';
  const isDisabled = loadingType !== null;


  const handleGithubSignIn = () => {
    setLoadingType('github');
    window.location.href = "/api/admin/github";
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-83 p-4 flex items-center justify-center bg-black/30"
      onClick={handleGithubSignIn}
      disabled={isDisabled}
    >
      <Image
        src="/logos/github.svg"
        alt="Github logo"
        width={20}
        height={20}
        className="mr-2 inline-block"
      />
      {isLoading ? "Redirecting..." : "Continue with Github"}
    </Button>
  );
};

export default SignInWithGithubButton;