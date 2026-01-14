// app/auth/github/route.ts (or pages/api/auth/github.ts)
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      // Point to YOUR callback route, not Supabase's
      redirectTo: `${request.nextUrl.origin}/admin/callback`,
    },
  });

  if (error) {
    console.error("GitHub OAuth error:", error);
    // Redirect to error page with error message
    return NextResponse.redirect(
      new URL(`/admin/auth-error?message=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  return NextResponse.redirect(data.url);
}