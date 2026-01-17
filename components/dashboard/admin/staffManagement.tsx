"use client";
import React, { useState } from 'react';
import { Search, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersSkeleton } from '../skeleton';
import type { StaffType, StaffFilter } from '@/types';
import { staffApi } from '@/lib/api';
import { useApiMutation } from '@/hooks/useapimutation';

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<StaffFilter>('all');
  const queryClient = useQueryClient();

  // ✅ Fetch staff list
  const { 
    data: staff = [], isLoading, error,   refetch } = useQuery({
    queryKey: ['staff-management'],
    queryFn: staffApi.getAll,
    retry: 2,
  });

  // ✅ Mutations
  const promoteMutation = useApiMutation(
    staffApi.promote,
    {
      successMessage: 'Staff promoted to admin successfully',
      errorMessage: 'Failed to promote staff',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      },
    }
  );

  const activateMutation = useApiMutation(
    staffApi.activate,
    {
      successMessage: 'Staff activated successfully',
      errorMessage: 'Failed to activate staff',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      },
    }
  );

  const deactivateMutation = useApiMutation(
    staffApi.deactivate,
    {
      successMessage: 'Staff deactivated successfully',
      errorMessage: 'Failed to deactivate staff',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      },
    }
  );

  // Filter staff
  const filteredStaff = staff.filter((member: StaffType) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  // ✅ Use isLoading from React Query
  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-600 text-center">
          <p className="font-semibold text-lg">Failed to load staff</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
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
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as StaffFilter)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Staff</option>
          <option value="staff">Staff Only</option>
          <option value="admin">Admins Only</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
                filteredStaff.map((member: StaffType) => (
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
                        {member.role === 'staff' && member.isActive && (
                          <button
                            onClick={() => promoteMutation.mutateWithToast(member._id)}
                            disabled={promoteMutation.isPending}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50"
                            title="Promote to Admin"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {member.isActive ? (
                          <button
                            onClick={() => deactivateMutation.mutateWithToast(member._id)}
                            disabled={deactivateMutation.isPending}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Deactivate Staff"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => activateMutation.mutateWithToast(member._id)}
                            disabled={activateMutation.isPending}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
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
            {staff.filter((s: StaffType) => s.role === 'admin').length}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Admins</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {staff.filter((s: StaffType) => s.isActive).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Active</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {staff.filter((s: StaffType)=> !s.isActive).length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">Inactive</div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;