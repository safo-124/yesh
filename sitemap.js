import prisma from '@/lib/prisma';

const URL = "https://www.gloryland.com"; // Replace with your actual domain

export default async function sitemap() {
  // Fetch all menu items to add them to the sitemap
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    select: {
      id: true,
      // You could add an 'updatedAt' field to your model for lastModified
    },
  });

  const menuItemUrls = menuItems.map(item => ({
    url: `${URL}/menu/${item.id}`, // Assuming you might have individual menu item pages later
    lastModified: new Date(),
  }));

  // Define your static pages
  const staticRoutes = [
    '', // Homepage
    '/menu',
    '/booking',
    '/about',
    '/gallery',
    '/contact',
  ].map(route => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...menuItemUrls,
  ];
}