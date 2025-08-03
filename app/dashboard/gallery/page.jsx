'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';

export default function GalleryManagementPage() {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error("Failed to load gallery images.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const response = await fetch(`/api/gallery?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed.");
      
      toast.success("Image uploaded successfully!", { id: toastId });
      fetchImages(); // Refresh the gallery
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const toastId = toast.loading("Deleting image...");
    try {
        const response = await fetch(`/api/gallery/${imageId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to delete.");
        
        toast.success("Image deleted successfully!", { id: toastId });
        fetchImages(); // Refresh the gallery
    } catch (error) {
        toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>Upload or delete images for the homepage gallery.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-semibold">Upload a new image</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to select a file.</p>
            </div>
            <Button disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
              {isUploading ? "Uploading..." : "Select Image"}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map(image => (
                <div key={image.id} className="relative group aspect-square">
                  <Image src={image.imageUrl} alt={image.altText || ''} fill className="object-cover rounded-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(image.id)}>
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No images in the gallery yet. Upload one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}