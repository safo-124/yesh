'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor'; // Import the new editor

export function AboutSectionDialog({ isOpen, setIsOpen, section, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '', // This will hold HTML content
    imagePosition: 'right',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(section);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: section.title,
          subtitle: section.subtitle || '',
          content: section.content,
          imagePosition: section.imagePosition,
        });
      } else {
        setFormData({ title: '', subtitle: '', content: '', imagePosition: 'right' });
      }
      setImageFile(null); // Reset image file on open
    }
  }, [section, isOpen, isEditMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContentChange = (newContent) => {
      setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = section?.imageUrl;

    if (imageFile) {
      const uploadResponse = await fetch(`/api/upload?filename=${imageFile.name}`, {
        method: 'POST', body: imageFile,
      });
      if (!uploadResponse.ok) {
        toast.error('Image upload failed.');
        setIsSubmitting(false);
        return;
      }
      const blob = await uploadResponse.json();
      imageUrl = blob.url;
    }

    if (!imageUrl) {
      toast.error('An image is required for the section.');
      setIsSubmitting(false);
      return;
    }

    const payload = { ...formData, imageUrl };
    const url = isEditMode ? `/api/about-sections/${section.id}` : '/api/about-sections';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} section.`);
      toast.success(`Section ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          <DialogDescription>Fill out the details for this section of the About page.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (e.g., THE CHEF)</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (e.g., Chef Adjei)</Label>
              <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
                content={formData.content}
                onContentChange={handleContentChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} />
                {isEditMode && <p className="text-xs text-muted-foreground">Leave blank to keep the current image.</p>}
             </div>
             <div className="space-y-2">
                <Label htmlFor="imagePosition">Image Position on Desktop</Label>
                <Select value={formData.imagePosition} onValueChange={(value) => setFormData(prev => ({ ...prev, imagePosition: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Section'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}