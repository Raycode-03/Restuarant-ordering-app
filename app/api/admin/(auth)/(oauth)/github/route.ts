import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { emailQueue } from "@/lib/queues/emailQueue";
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `https://pncaoqclkoynezcnntqf.supabase.co/auth/v1/callback`,
      ///auth/v1/callback
    },
  });
  

  if (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }

  return NextResponse.redirect(data.url);
}