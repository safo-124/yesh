'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SiteSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch the current hero image URL on load
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('/api/settings?key=heroImageUrl');
        if (response.ok) {
          const data = await response.json();
          if (data && data.value) {
            setHeroImageUrl(data.value);
          }
        }
      } catch (error) {
        toast.error('Could not load current hero image.');
      }
    };
    fetchHeroImage();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      // Create a temporary URL to show a preview
      setHeroImageUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!newImageFile) {
      toast.info('Please select a new image first.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Uploading new hero image...');

    try {
      // 1. Upload image to Vercel Blob
      const uploadResponse = await fetch(
        `/api/upload?filename=${newImageFile.name}`,
        {
          method: 'POST',
          body: newImageFile,
        }
      );

      if (!uploadResponse.ok) throw new Error('Image upload failed.');
      const newBlob = await uploadResponse.json();

      // 2. Save the new image URL to our database
      const settingsResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'heroImageUrl',
          value: newBlob.url,
        }),
      });

      if (!settingsResponse.ok) throw new Error('Failed to save the setting.');

      const updatedSetting = await settingsResponse.json();
      setHeroImageUrl(updatedSetting.value); // Update the displayed image
      setNewImageFile(null); // Clear the file input
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input visually

      toast.success('Hero image updated successfully!', { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage the content and appearance of the customer-facing website.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Hero Image</Label>
              <div className="w-full aspect-video rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
                {heroImageUrl ? (
                  <img
                    src={heroImageUrl}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No image set.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-image-upload">Upload New Hero Image</Label>
              <Input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                This will replace the current image on the homepage.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting || !newImageFile}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}