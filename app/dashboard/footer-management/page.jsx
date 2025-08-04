'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function FooterManagementPage() {
  const [settings, setSettings] = useState({
    footer_location: '',
    footer_hours_lunch: '',
    footer_hours_dinner: '',
    footer_social_facebook: '',
    footer_social_instagram: '',
    footer_social_twitter: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        // This would fetch multiple keys from your SiteSettings
        // For simplicity, we'll start with empty fields, but a real implementation
        // would fetch existing values.
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };
  
  const handleSave = async () => {
      setIsLoading(true);
      try {
          // We need an API that can save multiple settings at once
          const response = await fetch('/api/site-settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(settings)
          });
          if (!response.ok) throw new Error("Failed to save settings.");
          toast.success("Footer settings saved successfully!");
      } catch (error) {
          toast.error(error.message);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Content Management</CardTitle>
        <CardDescription>Update the information displayed in your website's footer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Location</Label>
            <Input name="footer_location" value={settings.footer_location} onChange={handleChange} placeholder="e.g., Aburi Hills, Eastern Region, Ghana" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Lunch Hours</Label>
                <Input name="footer_hours_lunch" value={settings.footer_hours_lunch} onChange={handleChange} placeholder="e.g., Wednesday to Sunday, 12pm-3pm" />
            </div>
            <div className="space-y-2">
                <Label>Dinner Hours</Label>
                <Input name="footer_hours_dinner" value={settings.footer_hours_dinner} onChange={handleChange} placeholder="e.g., Wednesday to Sunday, 6pm-10pm" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input name="footer_social_facebook" value={settings.footer_social_facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
            </div>
             <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input name="footer_social_instagram" value={settings.footer_social_instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
             <div className="space-y-2">
                <Label>Twitter URL</Label>
                <Input name="footer_social_twitter" value={settings.footer_social_twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
            </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Footer Settings'}</Button>
      </CardContent>
    </Card>
  );
}