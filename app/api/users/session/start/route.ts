// app/api/users/session/start/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Constants - keep these consistent across all endpoints
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  const supabase = await createClient();
  const { table_number } = await request.json();
  
  const { data: table, error: tableError } = await supabase
    .from('tables')
    .select('*')
    .eq('table_number', table_number)
    .single();
    
  if (tableError || !table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  // Check for existing active session
  const { data: existingSession } = await supabase
    .from('table_sessions')
    .select('*')
    .eq('table_id', table.id)
    .eq('is_active', true)
    .single();
  
  if (existingSession) {
    const now = new Date();
    const expiresAt = new Date(existingSession.expires_at);
    const lastActivity = new Date(existingSession.last_activity);
    
    // Use consistent threshold - 15 minutes
    const isExpired = now > expiresAt;
    const isInactive = now.getTime() - lastActivity.getTime() > INACTIVITY_THRESHOLD;
    
    if (isExpired || isInactive) {
      // Expire the old session
      await supabase
        .from('table_sessions')
        .update({ 
          is_active: false, 
          status: isExpired ? 'expired' : 'inactive',
          ended_at: now.toISOString()
        })
        .eq('id', existingSession.id);
      
      // Mark table as unoccupied
      await supabase
        .from('tables')
        .update({ is_occupied: false })
        .eq('id', table.id);
      
      // Continue to create new session below
    } else {
      // Session is still valid, update and return it
      await supabase
        .from('table_sessions')
        .update({ last_activity: now.toISOString() })
        .eq('id', existingSession.id);

      const cookieStore = await cookies();
      cookieStore.set('session_token', existingSession.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
      });

      return NextResponse.json({ session: existingSession });
    }
  }

  // Create new session
  const session_token = crypto.randomUUID();
  const now = new Date();

  const { data: newSession, error: sessionError } = await supabase
    .from('table_sessions')
    .insert({
      table_id: table.id,
      session_token: session_token,
      started_at: now.toISOString(),
      last_activity: now.toISOString(),
      expires_at: new Date(now.getTime() + SESSION_DURATION).toISOString(),
      status: 'active',
      is_active: true,
    })
    .select()
    .single();
    
  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 });
  }

  // Mark table as occupied
  await supabase
    .from('tables')
    .update({ is_occupied: true })
    .eq('id', table.id);

  const cookieStore = await cookies();
  cookieStore.set('session_token', session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  });

  return NextResponse.json({ session: newSession });
}