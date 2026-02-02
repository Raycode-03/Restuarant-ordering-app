import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  
  try {
    const supabase = await createClient()
    // verify admin 
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    //   get menus from supabase
    const { data: menus, error } = await supabase
      .from('menu_items')
      .select('id,price,name, description, image_url, video_url ,is_available, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch menus' },
        { status: 500 }
      );
    }

    // Transform to match frontend expectations (_id instead of id)
    const transformedMenus = menus.map(m => ({
      _id: m.id,
      price: m.price,
      name: m.name,
      description: m.description,
      imageUrl: m.image_url,
      videoUrl: m.video_url,
      isAvailable: m.is_available,
      createdAt: m.created_at,
    }));

    return NextResponse.json(transformedMenus, { status: 200 });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}