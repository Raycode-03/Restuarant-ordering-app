import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    
    if (error) {
      // Check if it's an email confirmation error
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return NextResponse.json(
          { 
            error: "Please verify your email before logging in. Check your inbox for the verification link.",
            code: "EMAIL_NOT_CONFIRMED"
          },
          { status: 401 }
        );
      }
        // Check for invalid credentials
      if (error.message.toLowerCase().includes("invalid")) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
