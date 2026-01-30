import React from 'react';
import MenuList from "@/components/menu/menulist";
import BulkUploadMenu from "@/components/menu/BulkUploadMenu";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-center">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Menu Management
          </h1>
          <p className="text-gray-600">
            Upload and manage your menu items
          </p>
        </div>

        {/* CENTERED CONTENT */}
        <div className="flex flex-col items-center gap-6 ">
          <BulkUploadMenu />
          <MenuList />
        </div>

      </div>
    </div>
  );
}