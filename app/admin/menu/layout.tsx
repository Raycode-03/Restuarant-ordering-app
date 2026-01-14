import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user || error) {
    redirect("/admin/login");
  }
  return (
    <>

        <div>
          {children}
        </div>
    </>
  );
}
