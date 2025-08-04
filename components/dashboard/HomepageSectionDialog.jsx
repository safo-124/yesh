'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function HomepageSectionDialog({ isOpen, setIsOpen, section, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = Boolean(section);
  const sectionType = formData.type || '';

  useEffect(() => {
    if (isOpen) {
      setFormData(isEditMode ? section : { type: 'CONTENT_IMAGE', layout: 'image-right' });
      setImageFile(null);
    }
  }, [section, isOpen, isEditMode]);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = section?.imageUrl;

    if (imageFile) {
      const uploadRes = await fetch(`/api/upload?filename=${imageFile.name}`, { method: 'POST', body: imageFile });
      if (!uploadRes.ok) {
        toast.error('Image upload failed.');
        setIsSubmitting(false);
        return;
      }
      const blob = await uploadRes.json();
      imageUrl = blob.url;
    }

    if (!imageUrl && ['HERO', 'CONTENT_IMAGE'].includes(sectionType)) {
      toast.error('An image is required for this section type.');
      setIsSubmitting(false);
      return;
    }

    const payload = { ...formData, imageUrl };
    const url = isEditMode ? `/api/homepage-sections/${section.id}` : '/api/homepage-sections';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Failed to save section.`);
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Homepage Section' : 'Add New Homepage Section'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
          <div className="space-y-2">
            <Label>Section Type</Label>
            <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HERO">Hero</SelectItem>
                <SelectItem value="CONTENT_IMAGE">Content with Image</SelectItem>
                <SelectItem value="FEATURED_ITEMS">Featured Items</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamically show fields based on type */}
          {['HERO', 'CONTENT_IMAGE', 'FEATURED_ITEMS'].includes(sectionType) && (
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" value={formData.title || ''} onChange={handleChange} />
            </div>
          )}
          {['HERO', 'FEATURED_ITEMS'].includes(sectionType) && (
             <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input name="subtitle" value={formData.subtitle || ''} onChange={handleChange} />
            </div>
          )}
          {sectionType === 'CONTENT_IMAGE' && (
            <div className="space-y-2">
              <Label>Content (supports HTML)</Label>
              <Textarea name="content" value={formData.content || ''} onChange={handleChange} rows={5} />
            </div>
          )}
          {['HERO', 'CONTENT_IMAGE'].includes(sectionType) && (
            <>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0])} />
              </div>
              {sectionType === 'CONTENT_IMAGE' && (
                <div className="space-y-2">
                  <Label>Image Layout</Label>
                  <Select value={formData.layout} onValueChange={(v) => handleSelectChange('layout', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image-right">Image on Right</SelectItem>
                      <SelectItem value="image-left">Image on Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
           {['HERO', 'CONTENT_IMAGE', 'FEATURED_ITEMS'].includes(sectionType) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input name="buttonText" value={formData.buttonText || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Button Link (e.g., /menu)</Label>
                <Input name="buttonLink" value={formData.buttonLink || ''} onChange={handleChange} />
              </div>
            </div>
           )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Section'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}