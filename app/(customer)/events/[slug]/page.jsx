import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getEventBySlug(slug) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug, isPublished: true },
    });
    return event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export default async function EventDetailPage({ params }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }
  
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-GH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
  });

  return (
    <div className="bg-white">
      {/* Hero Image Section */}
      <section className="relative h-[50vh] w-full text-white">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col justify-end container mx-auto pb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{event.title}</h1>
            <p className="flex items-center gap-2 mt-4 text-lg text-amber-300 font-semibold">
                <Calendar className="h-5 w-5" />
                {formattedDate}
            </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
           <div 
             className="prose lg:prose-xl max-w-none text-muted-foreground" 
             dangerouslySetInnerHTML={{ __html: event.description }}
           />
           <div className="mt-12 border-t pt-8 text-center">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>Ready to Join Us?</h3>
              <p className="text-muted-foreground mb-6">Book your table now to be part of this special event.</p>
              <Button size="lg" asChild style={{ backgroundColor: '#8B4513' }}>
                  <Link href="/booking">Book a Table</Link>
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}