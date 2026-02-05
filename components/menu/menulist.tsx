"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminMenuApi } from "@/lib/api";
import { BooksSkeleton } from "@/components/dashboard/skeleton";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import MediaDisplay from "./mediaDisplay";
import { MenuItem } from "@/types";
import EditMenuCard from '@/components/menu/editMenuCard';

const ITEMS_PER_PAGE = 10; 

export default function MenuList() {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<MenuItem | null>(null);
  const [page, setPage] = useState(0); 
  // Fetch menus for current page
  const { data: menus = [], isLoading, error } = useQuery({
    queryKey: ['menus', page],
  queryFn: () => adminMenuApi.getMenus(page, ITEMS_PER_PAGE),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const loadingToast = toast.loading('Updating menu item...');
      try {
        const result = await menuApi.editMenu(formData);
        toast.dismiss(loadingToast);
        return result;
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Menu updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['menus', page] });
      setEditData(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update menu');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const loadingToast = toast.loading('Deleting menu item...');
      try {
        const result = await adminMenuApi.deleteMenu(id);
        toast.dismiss(loadingToast);
        return result;
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Menu deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['menus', page] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete menu');
    },
  });

  const handleEdit = (formData: FormData) => editMutation.mutate(formData);
  const handleDelete = (id: string) => deleteMutation.mutate(id);

  const prevPage = () => setPage(old => Math.max(old - 1, 0));
  const nextPage = () => setPage(old => old + 1);

  if (isLoading) { return ( <div className="w-full"> <BooksSkeleton /> </div> ); }

  if (error) {
    toast.error("Failed to load menus");
    return null;
  }

  return (
    <>
      {/* Edit Modal */}
      {editData && (
        <EditMenuCard
          menuitem={editData}
          open={!!editData}
          onSubmit={handleEdit}
          onCancel={() => setEditData(null)}
          isLoading={editMutation.isPending}
        />
      )}

      {/* Menu Grid */}
      <div className="w-full max-w-7xl mx-auto grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <MediaDisplay
              video_url={menu.video_url}
              image_url={menu.image_url}
              alt={menu.name}
            />

            <CardContent className="p-4 space-y-2">
              <h3 className="text-base font-semibold line-clamp-1">{menu.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{menu.description}</p>
              <p className="text-lg font-bold text-blue-600">₦{menu.price.toLocaleString()}</p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-10 cursor-pointer"
                onClick={() => setEditData(menu)}
                disabled={editMutation.isPending}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 h-10 cursor-pointer"
                onClick={() => handleDelete(menu._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </CardFooter>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          size="sm"
          onClick={prevPage}
          disabled={page === 0}
        >
          Prev
        </Button>
        <span>Page {page + 1}</span>
        <Button
          size="sm"
          onClick={nextPage}
          disabled={menus.length < ITEMS_PER_PAGE} // disable next if less than 10 items
        >
          Next
        </Button>
      </div>
    </>
  );
}
