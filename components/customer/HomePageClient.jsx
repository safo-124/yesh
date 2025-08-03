'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PreLoader from './PreLoader';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function HomePageClient({ heroImageUrl, specialItems, testimonials, galleryImages }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  const scrollAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    viewport: { once: true, amount: 0.3 }
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

            {/* Section 1: Full-Screen Video Hero */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center text-center text-white overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0" poster={heroImageUrl}>
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
                <div className="relative z-20 p-4 max-w-4xl mx-auto flex flex-col items-center">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
                    >
                        Gloryland
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="mt-6 text-lg md:text-xl text-gray-200"
                    >
                        A Culinary Sanctuary in the Hills of Aburi
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
            
            {/* Alternating Content Sections */}
            <div className="bg-[#F8F8F8]">
              {/* Section 2: The Restaurant (Story) - Text Left, Image Right */}
              <motion.section 
                className="container mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16 py-24"
                variants={scrollAnimation} initial="initial" whileInView="whileInView" viewport={scrollAnimation.viewport}
              >
                <div className="max-w-md">
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#8B4513' }}>THE RESTAURANT</h3>
                  <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                    Nestled in the serene hills of Aburi, Gloryland offers a unique escape and a culinary journey inspired by the rich bounty of Ghana. We invite you to experience dining defined by nature.
                  </p>
                  <Button variant="outline" asChild className="mt-8 font-bold border-gray-400">
                      <Link href="/about">READ MORE</Link>
                  </Button>
                </div>
                <div className="relative w-full aspect-[4/5] shadow-lg">
                  <Image src="/gallery/about-us.jpg" alt="Gloryland restaurant interior" fill className="object-cover rounded-md" />
                </div>
              </motion.section>

              {/* Section 3: The Menu - Image Left, Text Right */}
              <motion.section 
                className="container mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16 py-24"
                variants={scrollAnimation} initial="initial" whileInView="whileInView" viewport={scrollAnimation.viewport}
              >
                 {/* This div contains the image. It will appear first on mobile. */}
                 <div className="relative w-full aspect-[4/5] shadow-lg">
                  <Image src={specialItems[0]?.imageUrl || '/gallery/image1.jpg'} alt="A featured dish from the menu" fill className="object-cover rounded-md" />
                </div>
                {/* This div contains the text. On desktop, it will appear first because the image has `md:order-last`. */}
                <div className="max-w-md md:order-first"> {/* <-- Text is ordered first on desktop */}
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#8B4513' }}>THE MENU</h3>
                  <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                    A curated selection of dishes that showcase the best of local and continental cuisine. Each plate is a testament to our commitment to quality and creativity.
                  </p>
                  <Button variant="outline" asChild className="mt-8 font-bold border-gray-400">
                      <Link href="/menu">READ MORE</Link>
                  </Button>
                </div>
              </motion.section>

               {/* Section 4: The Events/Setting - Text Left, Image Right */}
              <motion.section 
                className="container mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16 py-24"
                variants={scrollAnimation} initial="initial" whileInView="whileInView" viewport={scrollAnimation.viewport}
              >
                <div className="max-w-md">
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#8B4513' }}>EVENTS</h3>
                  <p className="mt-6 text-base text-muted-foreground leading-relaxed">
                    Celebrate with us. From intimate gatherings to grand occasions, Gloryland provides an unforgettable setting with breathtaking views and impeccable service.
                  </p>
                  <Button variant="outline" asChild className="mt-8 font-bold border-gray-400">
                      <Link href="/booking">READ MORE</Link>
                  </Button>
                </div>
                <div className="relative w-full aspect-[4/5] shadow-lg">
                  <Image src={galleryImages[0]?.imageUrl || '/gallery/image2.jpg'} alt="A table set for an event at Gloryland" fill className="object-cover rounded-md" />
                </div>
              </motion.section>
            </div>

            {/* Final Footer */}
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
                            <p>Aburi Hills</p>
                            <p>Eastern Region, Ghana</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">OPENING HOURS</h3>
                         <div className="text-sm text-muted-foreground">
                            <p>LUNCH</p>
                            <p>Wednesday to Sunday</p>
                            <p>12pm to 3pm</p>
                            <p className="mt-2">DINNER</p>
                            <p>Wednesday to Sunday</p>
                            <p>6pm to 10pm</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">SOCIAL</h3>
                        <nav className="space-y-2 text-sm text-muted-foreground">
                           <a href="#" className="block hover:text-black">Facebook</a>
                           <a href="#" className="block hover:text-black">Instagram</a>
                           <a href="#" className="block hover:text-black">Twitter</a>
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