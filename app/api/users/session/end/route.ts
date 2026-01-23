import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const supabase = await createClient();
  const cookieStore = await cookies();  
  const session_token = cookieStore.get('session_token')?.value;

  if (!session_token) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const { data: session } = await supabase
    .from('table_sessions')
    .select('*')
    .eq('session_token', session_token)
    .single();

  if (session) {
    // End session
    await supabase
      .from('table_sessions')
      .update({ 
        is_active: false, 
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', session.id);

    // Mark table as not occupied
    await supabase
      .from('tables')
      .update({ is_occupied: false })
      .eq('id', session.table_id);
  }

  // Clear cookie
  cookieStore.delete('session_token');

  return NextResponse.json({ success: true });
}