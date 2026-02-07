import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1️⃣ Get session token from cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ Verify session is active
    const { data: session, error: sessionError } = await supabase
      .from('table_sessions')
      .select('id, is_active')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session || !session.is_active) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { menuId, quantity } = await request.json();

    // 3️⃣ Add item to cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .upsert(
        {
          table_session_id: session.id,
          menu_item_id: menuId,
          quantity: quantity || 1,
        },
         { onConflict: 'table_session_id, menu_item_id' }
     );

    if (cartError) {
      console.log('Supabase cart error:', cartError);
      return NextResponse.json({ error: cartError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
