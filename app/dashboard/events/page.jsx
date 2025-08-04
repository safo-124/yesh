'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EventDialog } from '@/components/dashboard/EventDialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function EventsManagementPage() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to load events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddNew = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      toast.success("Event deleted successfully.");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchEvents();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Create and manage your special events.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.length > 0 ? events.map(event => (
            <div key={event.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Image src={event.imageUrl} alt={event.title} width={100} height={80} className="rounded-md object-cover aspect-[5/4]" />
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {event.title}
                    <Badge variant={event.isPublished ? 'default' : 'secondary'}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.eventDate).toLocaleDateString('en-GH', { dateStyle: 'full' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-center">
                <Button variant="outline" size="sm" onClick={() => handleEdit(event)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
              </div>
            </div>
          )) : (
            <p className="text-center text-muted-foreground py-8">No events created yet. Add one to get started!</p>
          )}
        </CardContent>
      </Card>
      <EventDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        event={selectedEvent}
        onSuccess={handleSuccess}
      />
    </>
  );
}