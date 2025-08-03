import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Star } from 'lucide-react';

async function getPageData() {
  try {
    // Fetch hero image and featured menu items in parallel for performance
    const [heroSetting, specialItems] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'heroImageUrl' } }),
      prisma.menuItem.findMany({
        where: { 
          isAvailable: true,
          isFeatured: true, // Fetch only items you've marked as featured
        },
        take: 4, // Show up to 4 featured items
      }),
    ]);
    
    const heroImageUrl = heroSetting?.value || '/placeholder-hero.jpg';
    return { heroImageUrl, specialItems };
  } catch (error) {
    console.error("Failed to fetch page data:", error);
    // Return default values in case of a database error
    return {
      heroImageUrl: '/placeholder-hero.jpg',
      specialItems: [],
    };
  }
}

// Example data for sections that are not dynamic
const testimonials = [
  {
    quote: "An absolute gem in Aburi! The food was divine, and the atmosphere is perfect for a relaxing evening. We'll be back!",
    name: "Ama Serwaa",
    rating: 5,
  },
  {
    quote: "Gloryland is our go-to spot for celebrations. The staff always make us feel special, and the jollof is the best in the Eastern Region, hands down.",
    name: "Kofi Mensah",
    rating: 5,
  },
   {
    quote: "A beautiful escape from the city. The view from the terrace is breathtaking. Perfect for a weekend lunch.",
    name: "Esi Thompson",
    rating: 5,
  },
];

const galleryImages = [
    { src: "/gallery/image1.jpg", alt: "Vibrant dish served at Gloryland" },
    { src: "/gallery/image2.jpg", alt: "Cozy interior of the restaurant" },
    { src: "/gallery/image3.jpg", alt: "Guests enjoying a meal on the terrace" },
    { src: "/gallery/image4.jpg", alt: "Close-up of a signature cocktail" },
];


export default async function HomePage() {
  const { heroImageUrl, specialItems } = await getPageData();

  return (
    <div className="flex flex-col text-gray-800">

      {/* 1. Full-Screen Video Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          poster={heroImageUrl}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="relative z-20 p-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            A Culinary Sanctuary in the Hills of Aburi
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200">
            An unforgettable dining experience defined by nature and flavor.
          </p>
          <Button size="lg" asChild className="mt-8 font-bold bg-amber-500 text-brown-900 hover:bg-amber-600">
            <Link href="/booking">Reserve Your Experience</Link>
          </Button>
        </div>
      </section>

      {/* 2. Introduction / Story Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: '#8B4513' }}>
                Our Philosophy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
                At Gloryland, we believe in harmony—between the ingredients on the plate and the stunning natural beauty of our home in Aburi. Our menu is a celebration of Ghana's rich bounty, thoughtfully crafted to create moments of pure delight. We invite you to escape, indulge, and create lasting memories with us.
            </p>
            <Button variant="link" asChild className="mt-6 font-bold text-lg" style={{ color: '#8B4513' }}>
                <Link href="/about">Discover Our Story <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
        </div>
      </section>
      
      {/* 3. Chef's Specials Section (Now fully dynamic) */}
       {specialItems.length > 0 && (
            <section className="py-20 md:py-32 bg-gray-50/50">
                <div className="container mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: '#8B4513' }}>Featured Dishes</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            A taste of our finest creations, curated by the chef and featured for you.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {specialItems.map(item => (
                            <div key={item.id} className="group relative overflow-hidden rounded-lg">
                                <Image src={item.imageUrl} alt={item.name} width={400} height={500} className="object-cover w-full h-96 transform group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                                    <p className="text-base font-bold text-amber-400">
                                        {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Button variant="outline" size="lg" asChild className="font-bold text-lg border-2 border-gray-300">
                            <Link href="/menu">Explore The Full Menu</Link>
                        </Button>
                    </div>
                </div>
            </section>
        )}

       {/* 4. Enhanced Footer */}
      <footer className="py-16 text-white" style={{ backgroundColor: '#442c14' }}>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
              <div className="md:col-span-2">
                  <h3 className="font-bold text-lg mb-4">GLORYLAND</h3>
                  <p className="text-gray-400">Food & Pub Joint</p>
                  <p className="text-gray-400 mt-2">Aburi, Eastern Region, Ghana</p>
              </div>
              <div>
                   <h3 className="font-bold text-lg mb-4">Navigate</h3>
                   <nav className="space-y-2">
                       <Link href="/menu" className="block text-gray-300 hover:text-white">Menu</Link>
                       <Link href="/booking" className="block text-gray-300 hover:text-white">Reservations</Link>
                       <Link href="/about" className="block text-gray-300 hover:text-white">Our Story</Link>
                   </nav>
              </div>
               <div>
                   <h3 className="font-bold text-lg mb-4">Connect</h3>
                   <nav className="space-y-2">
                       <a href="#" className="block text-gray-300 hover:text-white">Facebook</a>
                       <a href="#" className="block text-gray-300 hover:text-white">Instagram</a>
                       <a href="#" className="block text-gray-300 hover:text-white">Twitter</a>
                   </nav>
              </div>
          </div>
           <div className="container mx-auto text-center mt-12 border-t border-white/20 pt-8">
               <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Gloryland. All Rights Reserved.</p>
           </div>
      </footer>
    </div>
  );
}