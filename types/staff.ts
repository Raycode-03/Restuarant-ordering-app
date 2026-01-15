export type StaffRow = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string | null;
  role: 'staff' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};