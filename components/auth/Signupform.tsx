"use client"
import Link from "next/link";
import React ,{useState} from 'react'
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"; 
import { Separator } from "@/components/ui/separator";
import SignInWithGoogleButton from "@/components/auth/SignInWithGoogleButton"
import SignInWithGithubButton from "@/components/auth/Signinwithgithub"
import { useRouter } from "next/navigation";
export function SignUpForm() {
  const Login_content = {
  title: "Register to your account",
  description: "Enter your email and password to access your account.",
  success: "Signed up successfully!",
  error: "Unable to sign in.",
  button: "Log In",
  forgot_link: "Forgot-Password?",
  linkText: "Don't have an account?",
  linkButton: "Login",
  linkHref: "/admin/login",
  endpoint: "Signup",
};
  
  const [loading, setLoading] = useState(false);
  const router= useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Signup failed");
      } else {
        toast.success("Signup successful!");
        router.push("/admin/login"); // or wherever you want to redirect
      }
    } catch (error) {
      toast.error("Signup failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Heading */}
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-center">{Login_content.title}</CardTitle>
        <CardDescription className="text-center">{Login_content.description}</CardDescription>
      </CardHeader>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              disabled={loading}
            />
          </div>
          <div className="text-sm flex justify-end">
            <Link 
              href={`/${Login_content.forgot_link.toLowerCase()}`} 
              className="text-gray-500 mt-2 hover:underline hover:text-blue-300"
            >
              {Login_content.forgot_link.replace("-", " ")}
            </Link>
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex flex-col gap-3 mt-4">
          <Button 
            type="submit" 
            className="w-full bg-blue-600" 
            disabled={loading}
          >
            {loading ? "Loading..." : Login_content.button}
          </Button>

          <Separator className="my-2 bg-gray-200" />

          <div className="mt-1 space-y-3">
            <SignInWithGoogleButton/> 
            <SignInWithGithubButton/>
          </div>

          {/* Bottom Link */}
          <p className="text-sm text-gray-500 mt-2">
            {Login_content.linkText}
            <Link href={Login_content.linkHref}>
              <Button variant="link" type="button" className="p-0 h-auto text-blue-600">
                {Login_content.linkButton}
              </Button>
            </Link>
          </p>
        </CardFooter>
      </form>
    </>
  )
}
