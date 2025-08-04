import prisma from '@/lib/prisma';
import EventsPageClient from '@/components/customer/EventsPageClient';

async function getPublishedEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: 'asc' },
    });
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getPublishedEvents();
  
  return (
    <div className="bg-gray-50/50 py-20 md:py-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for special occasions, unique menus, and unforgettable experiences at Gloryland.
          </p>
        </div>
        
        {events.length > 0 ? (
          <EventsPageClient events={events} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No upcoming events scheduled at the moment. Please check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}