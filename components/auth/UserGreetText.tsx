"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
}

const UserGreetText = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      // First, get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Then fetch their profile from the profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // Fallback to auth user data
          setUserProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name
          });
        } else {
          setUserProfile({
            id: user.id,
            ...profile
          });
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, []);

  if (userProfile) {
    return (
      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        hello&nbsp;
        <code className="font-mono font-bold">
          {userProfile.full_name || userProfile.email || "user"}!
        </code>
      </p>
    );
  }

  return (
    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      Get started editing&nbsp;
      <code className="font-mono font-bold">app/page.tsx</code>
    </p>
  );
};

export default UserGreetText;