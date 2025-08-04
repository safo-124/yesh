'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export function ReviewDialog({ isOpen, setIsOpen, item }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!item || !item.id) {
      toast.error("Error: No item selected for review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rating: rating, 
          comment: comment, 
          menuItemId: item.id 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit review.");

      toast.success("Thank you for your review!");
      setIsOpen(false);
    } catch(error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review: {item.name}</DialogTitle>
          <DialogDescription>Share your thoughts on this dish.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 cursor-pointer transition-colors ${(hoverRating || rating) > i ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <Textarea 
            placeholder="Tell us more... (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}