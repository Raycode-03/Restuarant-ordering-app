import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch staff info
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('id, email, role')
    .eq('id', user.id)
    .single();
  
  if (staffError || !staff) {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }

  // Rate limit: Check if this staff member sent a request in last 24h
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { data: recentRequests } = await supabase
    .from('notifications')
    .select('id, created_at')
    .eq('requester_id', staff.id)
     .eq('type', 'activation_request')
    .gte('created_at', oneDayAgo.toISOString())
    .limit(1);
  console.log(recentRequests , staff.id)
  if (recentRequests && recentRequests.length > 0) {
    const recentRequest = recentRequests[0];
    const hoursSince = Math.ceil(
      (new Date().getTime() - new Date(recentRequest.created_at).getTime()) / (1000 * 60 * 60)
    );
    
    return NextResponse.json({ 
      error: `Please wait ${24 - hoursSince} more hour${24 - hoursSince !== 1 ? 's' : ''} before sending another request.` 
    }, { status: 429 });
  }

  // Get the single admin (since you only have one)
  const { data: admin } = await supabase
    .from('staff')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true)
    .single();  // ← Get single admin

  if (!admin) {
    return NextResponse.json({ error: "No active admin found" }, { status: 404 });
  }

  // Create notification for the admin
  const notification = {
    staff_id: admin.id,      // ← Now admin is defined
    requester_id: staff.id,
    type: 'activation_request',
    title: 'Account Activation Request',
    message: `${staff.email} has requested account activation.`,
  };

  const { error } = await supabase
    .from('notifications')
    .insert(notification);

  if (error) {
    console.error('Notification insert error:', error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true,
    message: "Activation request sent successfully"
  });
}