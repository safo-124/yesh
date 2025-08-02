'use client';

import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function MenuItemDialog({ isOpen, setIsOpen, onItemAdded }) {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("No image selected!");
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadPromise = fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      toast.promise(uploadPromise, {
        loading: 'Uploading image...',
        success: 'Image uploaded!',
        error: 'Image upload failed.',
      });
      
      const uploadResponse = await uploadPromise;
      if (!uploadResponse.ok) throw new Error("Upload failed");
      const newBlob = await uploadResponse.json();

      const newItemData = {
        name: form.name.value,
        description: form.description.value,
        price: form.price.value,
        category: form.category.value,
        imageUrl: newBlob.url,
      };

      const createResponse = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });
      
      if (!createResponse.ok) throw new Error("Failed to save item");

      const addedItem = await createResponse.json();
      onItemAdded(addedItem);
      toast.success("Menu item added successfully.");
      setIsOpen(false);

    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {/* This header section provides the necessary accessibility props */}
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new dish. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" name="description" className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image</Label>
              <Input id="image" type="file" ref={fileInputRef} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}