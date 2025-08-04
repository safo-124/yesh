'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import Pusher from 'pusher-js';
import { toast } from 'sonner';

export default function DashboardLayout({ children }) {
  useEffect(() => {
    // Only run this on the client
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusherClient.subscribe('dashboard-channel');

    channel.bind('new-booking', (data) => {
      toast.info('New Booking Request!', {
        description: data.message,
      });
      // Here you could also trigger a re-fetch of the bookings data
    });

    channel.bind('new-order', (data) => {
      toast.success('New Order Placed!', {
        description: data.message,
      });
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      pusherClient.unsubscribe('dashboard-channel');
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col" style={{ backgroundColor: '#F5F5F5' }}>
        <MobileNav />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}