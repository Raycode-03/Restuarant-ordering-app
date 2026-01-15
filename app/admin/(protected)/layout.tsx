import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserProvider } from "@/context/UserContext";
import InactiveAccount from "@/components/dashboard/InactiveStaff";
export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user || error) {
    redirect("/admin/login");
  }

  // Optional: Check if user exists in staff table and is active
  const { data: staff , error:staffError } = await supabase
    .from('staff')
    .select('id,email, role, is_active')
    .eq('id', user.id)
    .single();

  if (staffError || !staff )  redirect("/admin/unauthorized");

  if (staff.role !== "admin" && staff.role !== "staff")   redirect("/admin/unauthorized");
  if (!staff.is_active) {
    return <InactiveAccount />;
  }
    return <UserProvider user={user} staff={staff}>{children}</UserProvider>;
}