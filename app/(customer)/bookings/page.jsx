'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Users, PartyPopper } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/my-bookings');
        if (!response.ok) {
          throw new Error('Could not fetch bookings.');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-600 text-white">Confirmed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    }
  };

  const getBookingIcon = (type) => {
    switch(type) {
        case 'BIRTHDAY': return <PartyPopper className="h-5 w-5 text-[#8B4513]" />;
        case 'PARTY': return <Users className="h-5 w-5 text-[#8B4513]" />;
        case 'TABLE':
        default: return <Calendar className="h-5 w-5 text-[#8B4513]" />;
    }
  }

  if (status === 'loading' || loading) {
    return <div className="text-center py-20">Loading your bookings...</div>;
  }
  
  return (
    <div className="bg-gray-50/50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-center mb-8" style={{ color: '#8B4513' }}>
            My Bookings
          </h1>
        </motion.div>

        {bookings.length === 0 ? (
          <p className="text-center text-muted-foreground">You haven't made any bookings yet.</p>
        ) : (
          <motion.div 
            className="space-y-6"
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
            {bookings.map((booking) => (
              <motion.div key={booking.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <Card className="shadow-lg">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {getBookingIcon(booking.bookingType)}
                        <div>
                            <p className="font-bold">{booking.bookingType.charAt(0) + booking.bookingType.slice(1).toLowerCase()} Reservation</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(booking.eventDate).toLocaleDateString('en-GH', { dateStyle: 'full' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-center">
                        <p className="text-sm text-muted-foreground">{booking.partySize} Guests</p>
                        {getStatusBadge(booking.status)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}