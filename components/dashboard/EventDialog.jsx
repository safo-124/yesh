'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor'; // Reusing our powerful editor

export function EventDialog({ isOpen, setIsOpen, event, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    isPublished: false,
  });
  const [eventDate, setEventDate] = useState(new Date());
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(event);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: event.title,
          slug: event.slug,
          description: event.description,
          isPublished: event.isPublished,
        });
        setEventDate(new Date(event.eventDate));
      } else {
        setFormData({ title: '', slug: '', description: '', isPublished: false });
        setEventDate(new Date());
      }
      setImageFile(null);
    }
  }, [event, isOpen, isEditMode]);
  
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleContentChange = (newContent) => {
      setFormData(prev => ({ ...prev, description: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = event?.imageUrl;

    if (imageFile) {
      const uploadRes = await fetch(`/api/upload?filename=${imageFile.name}`, { method: 'POST', body: imageFile });
      if (!uploadRes.ok) {
        toast.error('Image upload failed.');
        setIsSubmitting(false); return;
      }
      const blob = await uploadRes.json();
      imageUrl = blob.url;
    }

    if (!imageUrl) {
      toast.error('A featured image is required.');
      setIsSubmitting(false); return;
    }

    const payload = { ...formData, imageUrl, eventDate };
    const url = isEditMode ? `/api/events/${event.id}` : '/api/events';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to save event.`);
      
      toast.success(`Event ${isEditMode ? 'updated' : 'created'} successfully!`);
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
          <DialogTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>Fill out the details for your special event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleTitleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={(e) => setFormData(p=>({...p, slug: e.target.value}))} required />
          </div>
           <div className="space-y-2">
            <Label>Event Description</Label>
            <RichTextEditor content={formData.description} onContentChange={handleContentChange} />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Event Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus /></PopoverContent>
                </Popover>
             </div>
             <div className="space-y-2">
                <Label>Featured Image</Label>
                <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0])} />
             </div>
           </div>
           <div className="flex items-center space-x-2">
                <Switch id="isPublished" checked={formData.isPublished} onCheckedChange={(c) => setFormData(p=>({...p, isPublished: c}))} />
                <Label htmlFor="isPublished">Publish Event (make it visible to customers)</Label>
           </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Event'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}