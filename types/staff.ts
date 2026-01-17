export interface StaffMember {
  id: string;
  role: 'staff' | 'admin';
  is_active: boolean;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffType {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'staff' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export type StaffFilter = 'all' | 'staff' | 'admin' | 'active' | 'inactive';