import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getHeroImageUrl() {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: 'heroImageUrl' },
    });
    return setting?.value || '/placeholder-hero.jpg'; // Provide a fallback image
  } catch (error) {
    console.error('Failed to fetch hero image:', error);
    return '/placeholder-hero.jpg'; // Return fallback on error
  }
}

export default async function HomePage() {
  const heroImageUrl = await getHeroImageUrl();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        <img
          src={heroImageUrl}
          alt="Restaurant hero background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Experience Culinary Excellence
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg md:text-xl">
            Unforgettable flavors, exquisite ambiance, and impeccable service
            await you.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/booking">Book Your Table</Link>
          </Button>
        </div>
      </section>

      {/* Other Sections */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A few reasons why our guests keep coming back for more.
          </p>
          {/* Add feature cards here */}
        </div>
      </section>
    </>
  );
}