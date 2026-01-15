"use client";
import { useUser } from "@/context/UserContext";
import AdminComponent from '@/components/dashboard/admin/users'
import StaffComponent from '@/components/dashboard/staff/orders'
export default function AdminHomePage() {
  const { user, staff } = useUser();

  return (
    <>
    {staff.role ==="admin"? 
        <>
          <AdminComponent/>
        </>
    : 
    
        <>
              <StaffComponent/>    <h1>Welcome, dd {staff.email} dd</h1> 
          
        </>
    }
    
    </>
  );
}

