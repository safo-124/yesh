'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function MenuItemDialog({ isOpen, setIsOpen, item, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(item);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
      });
    } else {
      // Reset form for new item
      setFormData({ name: '', description: '', price: '', category: '', isAvailable: true, isFeatured: false });
    }
  }, [item, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSwitchChange = (name, checked) => {
      setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    let imageUrl = item?.imageUrl; // Keep existing image if not changed
    
    // If a new image is selected, upload it
    if (imageFile) {
      const uploadResponse = await fetch(`/api/upload?filename=${imageFile.name}`, {
        method: 'POST',
        body: imageFile,
      });
      if (!uploadResponse.ok) {
        toast.error("Image upload failed.");
        setIsSubmitting(false);
        return;
      }
      const newBlob = await uploadResponse.json();
      imageUrl = newBlob.url;
    }
    
    if (!imageUrl && !isEditMode) {
        toast.error("An image is required for a new item.");
        setIsSubmitting(false);
        return;
    }

    const payload = { ...formData, imageUrl };
    const url = isEditMode ? `/api/menu/${item.id}` : '/api/menu';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} item.`);
        
        toast.success(`Menu item ${isEditMode ? 'updated' : 'created'} successfully!`);
        onSuccess();
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details for this item.' : 'Fill in the details for the new dish.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields for name, description, price, category */}
            <div className="flex items-center space-x-4">
                <Switch 
                    id="isAvailable" 
                    checked={formData.isAvailable} 
                    onCheckedChange={(checked) => handleSwitchChange('isAvailable', checked)}
                />
                <Label htmlFor="isAvailable">Available for Ordering</Label>
            </div>
            
            {/* The new "Featured" switch */}
            <div className="flex items-center space-x-4 pt-2 border-t">
                <Switch 
                    id="isFeatured" 
                    checked={formData.isFeatured} 
                    onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured" className="font-semibold">Feature on Homepage</Label>
            </div>
            
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}