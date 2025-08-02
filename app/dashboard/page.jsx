import prisma from '@/lib/prisma';
import DashboardClientUI from '@/components/dashboard/DashboardClientUI';

// The data-fetching part remains the same
async function getDashboardData() {
  const [pendingBookingsCount, upcomingBookingsCount, menuItemsCount, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({
      where: {
        status: 'CONFIRMED',
        eventDate: { gte: new Date() },
      },
    }),
    prisma.menuItem.count({ where: { isAvailable: true } }),
    prisma.booking.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    }),
  ]);

  return { pendingBookingsCount, upcomingBookingsCount, menuItemsCount, recentBookings };
}

// This is our main page (Server Component)
export default async function DashboardPage() {
  // 1. Fetch data on the server
  const { recentBookings, ...statsData } = await getDashboardData();

  // 2. Pass the data to the Client Component for rendering
  return <DashboardClientUI statsData={statsData} recentBookings={recentBookings} />;
}