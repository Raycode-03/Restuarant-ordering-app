// app/api/admin/(auth)/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();
        const {data: staff , error: staffError } = await supabase.from('staff').select('id').eq("email", email ).single();
      if (staffError || !staff) {
      return NextResponse.json(
        { error: "Staff email not found" },
        { status: 404 }
      );
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL}/admin/new-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Password reset link sent to your email." },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in forgot-password API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}