"use client";
import Link from "next/link"
import { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"; 
import { Separator } from "@/components/ui/separator";
import SignInWithGoogleButton from "@/components/auth/SignInWithGoogleButton"
import SignInWithGithubButton from "@/components/auth/Signinwithgithub"
import { useRouter } from "next/navigation";
import { useAuthLoading } from "@/components/auth/AuthLoadingContext";

const Login_content = {
  title: "Welcome back",
  description: "Enter your email and password to login",
  success: "Signed in successfully!",
  error: "Unable to sign in.",
  button: "Log In",
  forgot_link: "Forgot-Password?",
  linkText: "Don't have an account?",
  linkButton: "Sign up",
  linkHref: "/admin/signup",
  endpoint: "login",
};

export function LoginForm() {
  const { loadingType, setLoadingType } = useAuthLoading();
  const router = useRouter();
  
  const isFormLoading = loadingType === 'form';
  const isDisabled = loadingType !== null;
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingType('form');

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Login failed");
        setLoadingType(null);
      } else {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      setLoadingType(null);
    }
  };

  return (
    <>
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-center">{Login_content.title}</CardTitle>
        <CardDescription className="text-center">{Login_content.description}</CardDescription>
      </CardHeader>

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
              disabled={isDisabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="text-sm flex justify-end">
            <Link 
              href={`/admin/${Login_content.forgot_link.toLowerCase()}`} 
              className="text-gray-500 mt-2 hover:underline hover:text-blue-300"
            >
              {Login_content.forgot_link.replace("-", " ")}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 mt-4">
          <Button 
            type="submit" 
            className="w-full bg-blue-600" 
            disabled={isDisabled}
          >
            {isFormLoading ? "Loading..." : Login_content.button}
          </Button>

          <Separator className="my-2 bg-gray-200" />

          <div className="mt-1 space-y-3">
            <SignInWithGoogleButton/> 
            <SignInWithGithubButton/>
          </div>

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