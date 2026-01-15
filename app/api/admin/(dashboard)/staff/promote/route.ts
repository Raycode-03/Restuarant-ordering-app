// app/api/admin/staff/promote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { staffIdSchema } from "@/lib/validations/staff_validation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { ZodError } from "zod";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { staffId } = staffIdSchema.parse(body);

    // Check if staff exists and get current role
    const { data: staff, error: fetchError } = await supabaseAdmin
      .from("staff")
      .select("role")
      .eq("id", staffId)
      .single();

    if (fetchError || !staff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    if (staff.role === "admin") {
      return NextResponse.json(
        { error: "Staff is already an admin" },
        { status: 400 }
      );
    }

    // Update role to admin
    const { error: updateError } = await supabaseAdmin
      .from("staff")
      .update({ role: "admin" })
      .eq("id", staffId);

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { error: "Failed to promote staff" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Staff promoted to admin successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // ✅ Zod validation error
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    // ✅ Generic error fallback
    console.error("Error promoting staff:", error);
    return NextResponse.json(
      { error: "Failed to promote staff" },
      { status: 500 }
    );
  }
}
