'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PreLoader from './PreLoader';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Animation variant for sections to fade in as they're scrolled into view
const scrollAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  viewport: { once: true, amount: 0.2 }
};

// ============================================================================
// BLOCK COMPONENTS (Each corresponds to a 'type' in your CMS)
// ============================================================================

const HeroBlock = ({ section }) => (
  <section className="relative h-screen w-full flex flex-col items-center justify-center text-center text-white overflow-hidden">
    <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0" poster={section.imageUrl}>
        <source src={section.videoUrl || "/hero-video.mp4"} type="video/mp4" />
    </video>
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
    <div className="relative z-20 p-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
        >
            {section.title || "Gloryland"}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-200"
        >
            {section.subtitle || "A Culinary Sanctuary in the Hills of Aburi"}
        </motion.p>
    </div>
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 z-20 flex flex-col items-center gap-2 text-white font-semibold animate-bounce"
    >
        <span>Scroll Down</span>
        <ArrowDown className="h-5 w-5" />
    </motion.div>
  </section>
);

const ContentImageBlock = ({ section }) => (
  <motion.section 
    className="container mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16 py-24"
    variants={scrollAnimation} initial="initial" whileInView="whileInView" viewport={scrollAnimation.viewport}
  >
    <div className={`max-w-md ${section.layout === 'image-left' ? 'md:order-last' : ''}`}>
      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#8B4513' }}>{section.title}</h3>
      <div className="mt-6 text-base text-muted-foreground leading-relaxed prose" dangerouslySetInnerHTML={{ __html: section.content }} />
      {section.buttonText && section.buttonLink && (
        <Button variant="outline" asChild className="mt-8 font-bold border-gray-400">
            <Link href={section.buttonLink}>{section.buttonText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      )}
    </div>
    <div className="relative w-full aspect-[4/5] shadow-lg">
      <Image src={section.imageUrl || '/placeholder-hero.jpg'} alt={section.title || 'Gloryland section image'} fill className="object-cover rounded-md" />
    </div>
  </motion.section>
);

const FeaturedItemsBlock = ({ section, items }) => (
  <motion.section 
    className="py-20 md:py-32"
    variants={scrollAnimation} initial="initial" whileInView="whileInView" viewport={scrollAnimation.viewport}
  >
    <div className="container mx-auto">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: '#8B4513' }}>{section.title || "The Menu"}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{section.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg">
            <Image src={item.imageUrl} alt={item.name} width={400} height={500} className="object-cover w-full h-96 transform group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-16">
        <Button variant="outline" size="lg" asChild className="font-bold text-lg border-2 border-gray-300">
          <Link href={section.buttonLink || "/menu"}>{section.buttonText || "Explore The Full Menu"}</Link>
        </Button>
      </div>
    </div>
  </motion.section>
);


// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================

export default function HomePageClient({ homepageSections, featuredItems, galleryImages, footerSettings, testimonials }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = (section) => {
    switch (section.type) {
      case 'HERO':
        return <HeroBlock key={section.id} section={section} />;
      case 'CONTENT_IMAGE':
        return <ContentImageBlock key={section.id} section={section} />;
      case 'FEATURED_ITEMS':
        return <FeaturedItemsBlock key={section.id} section={section} items={featuredItems} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <PreLoader />}
      </AnimatePresence>
      
      {!isLoading && (
        <motion.div
            className="flex flex-col text-gray-800 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <Navbar />

            <main>
              {homepageSections.map((section, index) => (
                <div key={section.id} style={{ backgroundColor: index % 2 === 1 ? '#F8F8F8' : '#FFFFFF' }}>
                  {renderSection(section)}
                </div>
              ))}
            </main>
            
            <footer className="py-20" style={{ backgroundColor: '#ECECEC' }}>
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
                     <div>
                        <h3 className="font-semibold mb-4">SITEMAP</h3>
                        <nav className="space-y-2 text-sm text-muted-foreground">
                            <Link href="/about" className="block hover:text-black">About</Link>
                            <Link href="/menu" className="block hover:text-black">Menu</Link>
                            <Link href="/gallery" className="block hover:text-black">Gallery</Link>
                            <Link href="/booking" className="block hover:text-black">Reservations</Link>
                        </nav>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">LOCATION</h3>
                        <div className="text-sm text-muted-foreground">
                            <p>Gloryland</p>
                            <p>{footerSettings.footer_location || 'Aburi Hills, Eastern Region, Ghana'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">OPENING HOURS</h3>
                         <div className="text-sm text-muted-foreground">
                            <p>LUNCH</p>
                            <p>{footerSettings.footer_hours_lunch || 'Wednesday to Sunday: 12pm - 3pm'}</p>
                            <p className="mt-2">DINNER</p>
                            <p>{footerSettings.footer_hours_dinner || 'Wednesday to Sunday: 6pm - 10pm'}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">SOCIAL</h3>
                        <nav className="space-y-2 text-sm text-muted-foreground">
                           {footerSettings.footer_social_facebook && <a href={footerSettings.footer_social_facebook} className="block hover:text-black" target="_blank" rel="noopener noreferrer">Facebook</a>}
                           {footerSettings.footer_social_instagram && <a href={footerSettings.footer_social_instagram} className="block hover:text-black" target="_blank" rel="noopener noreferrer">Instagram</a>}
                           {footerSettings.footer_social_twitter && <a href={footerSettings.footer_social_twitter} className="block hover:text-black" target="_blank" rel="noopener noreferrer">Twitter</a>}
                        </nav>
                    </div>
                </div>
                <div className="container mx-auto text-center mt-16 border-t border-gray-300 pt-8">
                    <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} GLORYLAND. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </motion.div>
      )}
    </>
  );
}