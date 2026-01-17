// app/api/admin/staff/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  
  try {
    const supabase = await createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: staff, error } = await supabase
      .from('staff')
      .select('id, email, role, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch staff' },
        { status: 500 }
      );
    }

    // Transform to match frontend expectations (_id instead of id)
    const transformedStaff = staff.map(s => ({
      _id: s.id,
      email: s.email,
      role: s.role,
      isActive: s.is_active,
      createdAt: s.created_at,
    }));

    return NextResponse.json(transformedStaff, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}