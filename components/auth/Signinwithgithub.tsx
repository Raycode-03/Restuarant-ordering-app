"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SignInWithGithubButton = () => {
    const [loading, setLoading] = useState(false);

    const handleGithubSignIn = () => {
        setLoading(true);
        // Full page redirect - THIS IS CORRECT
        window.location.href = '/api/admin/github';
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full p-4"
            onClick={handleGithubSignIn}
            disabled={loading}
        >
            <Image 
                src="/logos/github.svg" 
                alt="github logo" 
                width={20} 
                height={20} 
                className="mr-2 inline-block"
            />
            {loading ? "Redirecting..." : "Continue with Github"}
        </Button>
    );
};

export default SignInWithGithubButton;