import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { MenuItemWithRestaurant  , CreateMenuItem} from "@/types";

export async function POST(request: Request) {
  try {
    
    console.log("Received POST request for bulk upload");
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
      const body = await request.json();
    // Validate items array
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid items array" },
        { status: 400 }
      );
    }

    // Get restaurant_id from restaurants table
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurant")
      .select("id")
      .single();

    if (restaurantError || !restaurant) {
      console.error("Restaurant fetch error:", restaurantError);
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Add restaurant_id to each item
    const itemsWithRestaurant: MenuItemWithRestaurant[] = body.items.map((item: CreateMenuItem) => ({
      ...item,
      restaurant_id: restaurant.id // Extract just the id, not the whole object
    }));

    // Insert all items
    const { data, error: insertError } = await supabase
      .from("menu_items")
      .insert(itemsWithRestaurant)
      .select();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { 
          success: false, 
          error: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data,
        count: data?.length || 0,
        message: `Successfully uploaded ${data?.length || 0} items`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Bulk upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}