'use client';

import { motion } from 'framer-motion';

const text = "GLORYLAND";

// Slower animation by increasing staggerChildren duration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }, // Slower stagger
  },
};

// Adjusted animation for a smoother feel
const childVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.8,
    },
  },
  hidden: {
    opacity: 0,
    y: 40, // Start from a bit lower
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
};

export default function PreLoader() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-[#FFF8E1] z-50" // Creamy background
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }} // Slower fade out
    >
      <motion.div
        className="flex text-5xl md:text-8xl font-bold tracking-widest"
        style={{ color: '#8B4513' }} // Branded brown color for the text
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((letter, index) => (
          <motion.span key={index} variants={childVariants}>
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}