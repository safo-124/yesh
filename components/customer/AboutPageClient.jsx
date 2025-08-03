'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPageClient({ sections }) {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    viewport: { once: true, amount: 0.3 }
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
              <Image src="/gallery/aburi-hills.jpg" alt="Lush hills of Aburi" fill className="object-cover" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
          <div className="relative z-20 p-4 max-w-4xl mx-auto">
              <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              >
                  Our Story
              </motion.h1>
          </div>
      </section>
      
      {/* Dynamic Content Sections */}
      {sections.map((section, index) => (
          <section key={section.id} className={`py-24 md:py-32 ${index % 2 === 0 ? 'bg-[#F8F8F8]' : 'bg-white'}`}>
              <motion.div 
                  className="container mx-auto grid md:grid-cols-2 items-center gap-8 md:gap-16"
                  variants={fadeIn} initial="initial" whileInView="whileInView" viewport={fadeIn.viewport}
              >
                  <div className={`prose max-w-md ${section.imagePosition === 'left' ? 'md:order-last' : 'md:order-first'}`}>
                      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: '#8B4513' }}>{section.title}</h3>
                      {section.subtitle && <p className="mt-4 text-xl font-semibold">{section.subtitle}</p>}
                      {/* This will safely render the HTML content from the editor */}
                      <div className="mt-4 text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                  <div className="relative w-full aspect-[4/5] shadow-lg">
                      <Image src={section.imageUrl} alt={section.title} fill className="object-cover rounded-md" />
                  </div>
              </motion.div>
          </section>
      ))}
    </div>
  );
}