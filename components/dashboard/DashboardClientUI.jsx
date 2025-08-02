'use client';

import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UtensilsCrossed, CalendarClock, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export default function DashboardClientUI({ statsData, recentBookings }) {
  const stats = [
    { title: "Pending Bookings", value: statsData.pendingBookingsCount, icon: <BellRing className="h-5 w-5 text-amber-600" /> },
    { title: "Confirmed Upcoming", value: statsData.upcomingBookingsCount, icon: <CalendarClock className="h-5 w-5 text-amber-600" /> },
    { title: "Available Menu Items", value: statsData.menuItemsCount, icon: <UtensilsCrossed className="h-5 w-5 text-amber-600" /> }
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
          Welcome back to Gloryland!
        </h1>
        <p className="text-muted-foreground">Here's a quick look at your restaurant's activity.</p>
      </motion.div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.title} index={index} {...stat} />
        ))}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <MotionCard 
          className="lg:col-span-2 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardHeader>
            <CardTitle>Recent Booking Requests</CardTitle>
            <CardDescription>
              The latest 5 pending requests that need your attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-amber-500">
                      <AvatarImage src={booking.user.image || ''} alt="Avatar" />
                      <AvatarFallback style={{ backgroundColor: '#DAA520' }} className="text-white">
                        {booking.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.user.name} ({booking.partySize} guests)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.eventDate).toLocaleDateString('en-GH', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                 <Button asChild className="mt-6 w-full" style={{ backgroundColor: '#8B4513' }}>
                    <Link href="/dashboard/bookings">View All Bookings</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending booking requests. Good job!
              </p>
            )}
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}