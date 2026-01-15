// app/api/admin/staff/route.ts
// GET & POST with Supabase
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
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

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
    
    

//     // Check if email already exists
//     const { data: existingStaff } = await supabaseAdmin
//       .from('staff')
//       .select('email')
//       .eq('email', validatedData.email)
//       .single();

//     if (existingStaff) {
//       return NextResponse.json(
//         { error: 'Email already in use' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(validatedData.password, 10);

//     // Create staff
//     const { data: newStaff, error } = await supabaseAdmin
//       .from('staff')
//       .insert({
//         name: validatedData.name,
//         email: validatedData.email,
//         password: hashedPassword,
//         image: validatedData.image,
//         role: validatedData.role,
//         is_active: validatedData.is_active,
//       })
//       .select('id, name, email, image, role, is_active, created_at')
//       .single();

//     if (error) {
//       console.error('Supabase error:', error);
//       return NextResponse.json(
//         { error: 'Failed to create staff' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         message: 'Staff created successfully', 
//         staff: {
//           _id: newStaff.id,
//           name: newStaff.name,
//           email: newStaff.email,
//           image: newStaff.image,
//           role: newStaff.role,
//           isActive: newStaff.is_active,
//           createdAt: newStaff.created_at,
//         }
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     if (error.name === 'ZodError') {
//       return NextResponse.json(
//         { error: 'Validation failed', details: error.errors },
//         { status: 400 }
//       );
//     }

//     console.error('Error creating staff:', error);
//     return NextResponse.json(
//       { error: 'Failed to create staff' },
//       { status: 500 }
//     );
//   }
// }
