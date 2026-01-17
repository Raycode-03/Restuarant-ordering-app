import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { data: restaurant, error } = await supabase
      .from('restaurant')
      .select('table_count , order_code')
      .single();
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch restaurant settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: restaurant 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant settings' },
      { status: 500 }
    );
  }
}