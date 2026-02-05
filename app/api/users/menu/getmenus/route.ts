// /api/menus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);

    const limit = Number(url.searchParams.get('limit')) || 10;
    const offset = Number(url.searchParams.get('offset')) || 0;

    const { data: menus, error } = await supabase
      .from('menu_items')
      .select('id,price,name,category,description,image_url,video_url,is_available,created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

      if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch menus', details: error.message },
        { status: 500 }
      );
      }

    const transformedMenus = menus.map(m => ({
      _id: m.id,
      price: m.price,
      name: m.name,
      description: m.description,
      category: m.category,
      image_url: m.image_url,
      video_url: m.video_url,
      is_available: m.is_available,
      created_at: m.created_at,
    }));

    return NextResponse.json(transformedMenus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}
