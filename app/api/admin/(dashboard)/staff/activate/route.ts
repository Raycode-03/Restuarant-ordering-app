// app/api/admin/staff/activate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { staffIdSchema } from "@/lib/validations/staff_validation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { ZodError } from "zod";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { staffId } = staffIdSchema.parse(body);

    // Check if staff exists
    const { data: staff, error: fetchError } = await supabaseAdmin
      .from("staff")
      .select("is_active")
      .eq("id", staffId)
      .single();

    if (fetchError || !staff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    if (staff.is_active) {
      return NextResponse.json(
        { error: "Staff is already active" },
        { status: 400 }
      );
    }

    // Activate staff
    const { error: updateError } = await supabaseAdmin
      .from("staff")
      .update({ is_active: true })
      .eq("id", staffId);

    if (updateError) {
      console.error("Supabase error:", updateError);
      return NextResponse.json(
        { error: "Failed to activate staff" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Staff activated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("Error activating staff:", error);
    return NextResponse.json(
      { error: "Failed to activate staff" },
      { status: 500 }
    );
  }
}
