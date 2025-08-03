'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PreLoader from './PreLoader';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Star } from 'lucide-react';

export default function HomePageClient({ heroImageUrl, specialItems, testimonials, galleryImages }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Optional: Prevent scrolling while loader is active
      document.body.style.overflow = 'auto'; 
    }, 4000); // 3 seconds for the animation

    // Optional: Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';

    return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <PreLoader />}
      </AnimatePresence>
      
      {!isLoading && (
        <motion.div
            className="flex flex-col text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <Navbar /> {/* Navbar is rendered inside the main content */}

            {/* 1. Full-Screen Video Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0" poster={heroImageUrl}>
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
                <div className="relative z-20 p-4 max-w-4xl mx-auto">
                    {/* Hero content here... */}
                </div>
            </section>
            
            {/* 2. Introduction / Story Section */}
            <section className="py-20 md:py-32 bg-white">
                {/* Story content here... */}
            </section>
            
            {/* 3. The Menu (Featured Items) Section */}
            <section className="py-20 md:py-32 bg-gray-50/50">
                {/* Menu content here... */}
            </section>
            
            {/* 4. Enhanced Footer */}
            <footer className="py-16 text-white" style={{ backgroundColor: '#442c14' }}>
                {/* Footer content here... */}
            </footer>
        </motion.div>
      )}
    </>
  );
}