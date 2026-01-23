// app/api/admin/settings/tablenumber/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { table_count } = body;
    
    // Validate table count
    if (!table_count || table_count < 1 || table_count > 100) {
      return NextResponse.json(
        { success: false, error: 'Table count must be between 1 and 100' },
        { status: 400 }
      );
    }
    
    // Get current restaurant
    const { data: currentRestaurant } = await supabase
      .from('restaurant')
      .select('id')
      .maybeSingle();
    
    if (!currentRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Update restaurant table count
    const { data: restaurant, error } = await supabase
      .from('restaurant')
      .update({
        table_count: table_count,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentRestaurant.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update table count' },
        { status: 500 }
      );
    }

    // Delete all existing tables for this restaurant
    await supabase
      .from('tables')
      .delete()
      .eq('restaurant_id', currentRestaurant.id);

    // Create new table records
    const tablesToInsert = [];
    for (let i = 1; i <= table_count; i++) {
      tablesToInsert.push({
        table_number: i,
        restaurant_id: currentRestaurant.id,
        is_occupied: false
      });
    }

    // Insert all tables at once
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .insert(tablesToInsert)
      .select();

    if (tablesError) {
      console.error('Tables insert error:', tablesError);
      return NextResponse.json(
        { success: false, error: 'Failed to create table records' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        restaurant,
        tables
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating table count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update table count' },
      { status: 500 }
    );
  }
}