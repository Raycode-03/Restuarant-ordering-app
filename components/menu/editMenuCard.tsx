"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Upload, Video, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from "sonner"
import { MenuItem } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '@/lib/api'

interface EditMenuCardProps {
  menuitem: MenuItem
  onSuccess: () => void
  onCancel: () => void
}

function EditMenuCard({ menuitem, onSuccess, onCancel }: EditMenuCardProps) {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: menuitem.name || '',
    description: menuitem.description || '',
    category: menuitem.category || '',
    price: menuitem.price || 0,   
    is_veg: menuitem.is_veg || false,
    is_vegan: menuitem.is_vegan || false,
    is_available: menuitem.is_available ?? true,
  })
  
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')

  // ✅ FIXED: Only set media if it exists, don't force a type
  useEffect(() => {
    if (menuitem.image_url) {
      setMediaType('image');
      setMediaPreview(menuitem.image_url);
    } else if (menuitem.video_url) {
      setMediaType('video');
      setMediaPreview(menuitem.video_url);
    }
    // If neither exists, leave everything null/empty
  }, [menuitem]);

  const editMutation = useMutation({
    mutationFn: (formDataToSend: FormData) => menuApi.editMenu(formDataToSend),
    onSuccess: () => {
      toast.success("Menu item updated successfully!")
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      onSuccess()
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-radix-select-trigger]') ||
        target.closest('[data-radix-select-content]')
      ) {
        return;
      }
      if (formRef.current && !formRef.current.contains(target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const formDataToSend = new FormData()
    formDataToSend.append('id', menuitem._id)
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('category', formData.category)
    formDataToSend.append('is_veg', formData.is_veg.toString())
    formDataToSend.append('is_vegan', formData.is_vegan.toString())
    formDataToSend.append('is_available', formData.is_available.toString())
    
    // Only add media if new file selected
    if (mediaFile && mediaType) {
      formDataToSend.append('media', mediaFile)
      formDataToSend.append('mediaType', mediaType)
    }
    
    editMutation.mutate(formDataToSend)
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error('Please select an image or video file')
      return
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB')
      return
    }
    
    const type = isImage ? 'image' : 'video';
    setMediaFile(file)
    setMediaType(type)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // ✅ FIXED: Clear to original state OR completely empty
  const clearMedia = () => {
    setMediaFile(null)
    
    // Reset to original menu item media if it exists
    if (menuitem.image_url) {
      setMediaPreview(menuitem.image_url)
      setMediaType('image')
    } else if (menuitem.video_url) {
      setMediaPreview(menuitem.video_url)
      setMediaType('video')
    } else {
      // No original media, clear everything
      setMediaPreview('')
      setMediaType(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" 
        ref={formRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Menu Item</h2>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700"
            disabled={editMutation.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              disabled={editMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
              disabled={editMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appetizer">Appetizer</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
                <SelectItem value="Sides">Sides</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              required
              disabled={editMutation.isPending}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₦) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              required
              disabled={editMutation.isPending}
            />
          </div>

          {/* Media Upload - Optional */}
          <div className="space-y-3">
            <Label>Media (Optional)</Label>
            <div 
              className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition"
              onClick={() => !editMutation.isPending && document.getElementById('mediaFile')?.click()}
            >
              <Input
                id="mediaFile"
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
                disabled={editMutation.isPending}
              />

              {mediaPreview ? (
                <div className="relative w-full">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearMedia();
                    }}
                    className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full"
                    disabled={editMutation.isPending}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  
                  <div className="relative w-full h-48 rounded-md overflow-hidden mb-3 bg-gray-100">
                    {mediaType === 'video' ? (
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={mediaPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    {mediaType === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    <span>
                      {mediaFile 
                        ? `New ${mediaType} selected - Click to change` 
                        : `Current ${mediaType} - Click to change`}
                    </span>
                  </div>
                </div>
              ) : (
                // ✅ Empty state - no media
                <div className="py-8">
                  <div className="flex justify-center gap-4 mb-3">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                    <span className="text-gray-300">or</span>
                    <Video className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {menuitem.image_url || menuitem.video_url 
                      ? 'Click to change media' 
                      : 'Click to add image or video'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Images: PNG, JPG, GIF | Videos: MP4, WebM
                  </p>
                  <p className="text-xs text-gray-400">Up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Dietary Options */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_veg}
                onChange={(e) => handleChange('is_veg', e.target.checked)}
                className="w-4 h-4"
                disabled={editMutation.isPending}
              />
              <span className="text-sm">Vegetarian</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_vegan}
                onChange={(e) => handleChange('is_vegan', e.target.checked)}
                className="w-4 h-4"
                disabled={editMutation.isPending}
              />
              <span className="text-sm">Vegan</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => handleChange('is_available', e.target.checked)}
                className="w-4 h-4"
                disabled={editMutation.isPending}
              />
              <span className="text-sm">Available</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
              disabled={editMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={editMutation.isPending} 
              className="flex-1"
            >
              {editMutation.isPending ? 'Updating...' : 'Update Menu'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMenuCard