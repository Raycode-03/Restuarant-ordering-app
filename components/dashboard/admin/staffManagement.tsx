"use client";
import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type StaffType = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'staff' | 'admin';
  isActive: boolean;
  createdAt: string;
};
type StaffFilter = 'all' | 'staff' | 'admin' | 'active' | 'inactive';

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<StaffFilter>('all');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/staff');
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      const data = await response.json();
      
      // ✅ FIX: Ensure data is an array
      if (Array.isArray(data)) {
        setStaff(data);
      } else {
        console.error('Expected array but got:', data);
        setStaff([]);
        toast.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast.error('Failed to load staff');
      setStaff([]); // ✅ Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilter(e.target.value as StaffFilter);
  };

  // Filter staff - safely handles empty array
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'staff' ? member.role === 'staff' :
      filter === 'admin' ? member.role === 'admin' :
      filter === 'active' ? member.isActive :
      filter === 'inactive' ? !member.isActive : true;
    
    return matchesSearch && matchesFilter;
  });

  const promoteToAdmin = async (staffId: string) => {
    try {
      const res = await fetch(`/api/admin/staff/promote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data?.error || 'Error promoting staff to admin');
      } else {
        toast.success('Staff promoted to admin successfully');
        fetchStaff();
      }
    } catch (error) {
      console.error('Failed to promote staff:', error);
      toast.error('Failed to promote staff');
    }
  };

  const activateStaff = async (staffId: string) => {
    try {
      const res = await fetch(`/api/admin/staff/activate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data?.error || 'Error activating staff');
      } else {
        toast.success('Staff activated successfully');
        fetchStaff();
      }
    } catch (error) {
      console.error('Failed to activate staff:', error);
      toast.error('Failed to activate staff');
    }
  };

  const deactivateStaff = async (staffId: string) => {
    try {
      const res = await fetch(`/api/admin/staff/deactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data?.error || 'Error deactivating staff');
      } else {
        toast.success('Staff deactivated successfully');
        fetchStaff();
      }
    } catch (error) {
      console.error('Failed to deactivate staff:', error);
      toast.error('Failed to deactivate staff');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Staff</option>
            <option value="staff">Staff Only</option>
            <option value="admin">Admins Only</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[30%]">
                  Staff Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%] hidden md:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
            
                        <div className="ml-3 min-w-0 flex-1">
                      
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' 
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        {/* Promote to Admin */}
                        {member.role === 'staff' && member.isActive && (
                          <button
                            onClick={() => promoteToAdmin(member._id)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Promote to Admin"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Activate/Deactivate */}
                        {member.isActive ? (
                          <button
                            onClick={() => deactivateStaff(member._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Deactivate Staff"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => activateStaff(member._id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Activate Staff"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      {staff.length === 0 ? 'No staff members found' : 'No results match your search'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {staff.length}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Total Staff</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {staff.filter(s => s.role === 'admin').length}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Admins</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {staff.filter(s => s.isActive).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Active</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {staff.filter(s => !s.isActive).length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">Inactive</div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;