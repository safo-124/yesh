import prisma from '@/lib/prisma';
import HomePageClient from '@/components/customer/HomePageClient';

async function getPageData() {
  try {
    // Fetch hero image, featured items, AND gallery images in parallel
    const [heroSetting, specialItems, galleryImages] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'heroImageUrl' } }),
      prisma.menuItem.findMany({
        where: { isAvailable: true, isFeatured: true },
        take: 4,
        orderBy: { price: 'desc' },
      }),
      prisma.galleryImage.findMany({
        orderBy: { order: 'asc' },
        take: 8, // Fetch up to 8 images for the gallery
      }),
    ]);
    
    const heroImageUrl = heroSetting?.value || '/placeholder-hero.jpg';
    return { heroImageUrl, specialItems, galleryImages };
  } catch (error) {
    console.error("Failed to fetch page data:", error);
    // Return default values to prevent a crash
    return {
      heroImageUrl: '/placeholder-hero.jpg',
      specialItems: [],
      galleryImages: [],
    };
  }
}

// Example data for sections that are not dynamic
const testimonials = [
  {
    quote: "An absolute gem in Aburi! The food was divine...",
    name: "Ama Serwaa",
  },
  {
    quote: "Gloryland is our go-to spot for celebrations...",
    name: "Kofi Mensah",
  },
];


export default async function HomePage() {
  const { heroImageUrl, specialItems, galleryImages } = await getPageData();

  return (
    <HomePageClient
      heroImageUrl={heroImageUrl}
      specialItems={specialItems}
      testimonials={testimonials}
      galleryImages={galleryImages}
    />
  );
}