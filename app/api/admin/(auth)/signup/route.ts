import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { emailQueue } from "@/lib/queues/emailQueue";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();
    
    // Proceed with signup
    const { data, error } = await supabase.auth.signUp({
      email,  
      password,
    });

    if (error) {
      console.error("Supabase signup error:", error);

      if (
        error.message.includes("timeout") ||
        error.message.includes("ECONNRESET") ||
        error.message.includes("fetch failed")
      ) {
        return NextResponse.json(
          { error: "Connection timeout. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // ✅ ONLY enqueue email if signup succeeded
    if (data.user?.email) {
      await emailQueue.add("send-welcome-email", {
        email: data.user.email,
        name: data.user.user_metadata?.full_name || "",
      });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      email: data.user?.email, // Include email in response
    });

  } catch (err) {
    console.error("Signup route error:", err);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed" },
      { status: 500 }
    );
  }
}