'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventsPageClient({ events }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {events.map(event => (
        <motion.div
          key={event.id}
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="h-full"
        >
          <Link href={`/events/${event.slug}`} className="h-full block">
            <Card className="h-full overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <div className="relative w-full h-64">
                <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.eventDate).toLocaleDateString('en-GH', { dateStyle: 'full' })}
                </p>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>{event.title}</h3>
                <div className="mt-auto text-amber-600 font-semibold flex items-center">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}