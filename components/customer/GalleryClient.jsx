'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GalleryClient({ images }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image) => (
        <motion.div
          key={image.id}
          className="relative group aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-lg"
          variants={itemVariants}
          layout
        >
          <Image
            src={image.imageUrl}
            alt={image.altText || 'Gloryland Gallery'}
            fill
            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
          />
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </motion.div>
  );
}