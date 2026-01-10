"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
// import { signout } from "@/lib/auth-actions";
interface User {
  name:string;
  email:string;

}
const LoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error.message);
    setUser(null);
    return;
  }
  if (user) {
    setUser({
      name: user.user_metadata?.full_name || "No Name",
      email: user.email || ""
    });
  } else {
    setUser(null);
  }
};

    fetchUser();
  }, []);
  if (user) {
    return (
      <Button
        onClick={() => {
          // signout();
          setUser(null);
        }}
      >
        Log out
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push("/auth/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;