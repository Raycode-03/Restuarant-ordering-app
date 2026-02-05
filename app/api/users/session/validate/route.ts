// app/api/users/session/validate/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Same constants as start endpoint
const INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const session_token = cookieStore.get('session_token')?.value;

  if (!session_token) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const { data: session, error } = await supabase
    .from('table_sessions')
    .select(`
      *,
      tables (
        id,
        table_number,
        is_occupied
      )
    `)
    .eq('session_token', session_token)
    .eq('is_active', true)
    .single();

  if (error || !session) {
    cookieStore.delete('session_token');
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  // Check if expired
  if (now > expiresAt) {
    await supabase
      .from('table_sessions')
      .update({ 
        is_active: false, 
        status: 'expired',
        ended_at: now.toISOString()
      })
      .eq('id', session.id);

    await supabase
      .from('tables')
      .update({ is_occupied: false })
      .eq('id', session.table_id);

    cookieStore.delete('session_token');
    
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  // Check inactivity - 15 minutes (consistent)
  const lastActivity = new Date(session.last_activity);
  
  if (now.getTime() - lastActivity.getTime() > INACTIVITY_THRESHOLD) {
    await supabase
      .from('table_sessions')
      .update({ 
        is_active: false, 
        status: 'inactive',
        ended_at: now.toISOString()
      })
      .eq('id', session.id);

    await supabase
      .from('tables')
      .update({ is_occupied: false })
      .eq('id', session.table_id);

    cookieStore.delete('session_token');
    
    return NextResponse.json({ error: "Session inactive" }, { status: 401 });
  }

  // Update last activity
  await supabase
    .from('table_sessions')
    .update({ last_activity: now.toISOString() })
    .eq('id', session.id);

  return NextResponse.json({ session });

}