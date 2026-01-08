import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { emailQueue } from "@/lib/queues/emailQueue";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({ email, password });
      if (data.user?.email) {
        //  Enqueue a job to send welcome email
        await emailQueue.add("send-welcome-email", {
            email: data.user.email,
            name: data.user.user_metadata?.full_name || "",
        });
    }
    if (error) {
      // Handle network/timeout errors separately if you want
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

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signup failed" },
      { status: 500 }
    );
  }
}
