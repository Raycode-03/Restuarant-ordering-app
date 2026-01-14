"use client";
import { useUser } from "@/context/UserContext";
import AdminComponent from '@/components/dashboard/admin/users'
import StaffComponent from '@/components/dashboard/staff/orders'
import InactiveAccount from '@/components/dashboard/InactiveStaff';
export default function AdminHomePage() {
  const { user, staff } = useUser();
   if (!staff.is_active) {
    return <InactiveAccount />;
  }
  return (
    <>
    {staff.role ==="admin"? 
        <>
          <h1>Welcome, {staff.email}</h1>
          <p>Your role: {staff.role}</p>
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

