'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Calendar, Users, Settings, ShoppingCart, ImageIcon, BookUser } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
     { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/dashboard/menu-management', label: 'Menu', icon: Utensils },
     { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/about-management', label: 'About Page', icon: BookUser },
    { href: '/dashboard/site-settings', label: 'Site Settings', icon: Settings },
  ];

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const linkVariants = {
    hover: { scale: 1.05, x: 5, color: "#DAA520" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.aside 
      className="hidden md:block w-64 flex-col text-white"
      // 👇 This is the updated style section
      style={{
        backgroundColor: 'rgba(139, 69, 19, 0.95)', // SaddleBrown at 95% opacity
        backdropFilter: 'saturate(180%) blur(10px)', // Glassmorphism effect
      }}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-20 items-center justify-center px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold text-white">
            <Image src="/logo.jpg" width={40} height={40} alt="logo" className="rounded-full border-2 border-amber-200" />
            <span className="text-xl">Gloryland</span>
          </Link>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div key={link.href} whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                      isActive ? 'text-white font-bold' : 'text-gray-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        className="absolute left-0 h-8 w-1 rounded-r-full" 
                        style={{ backgroundColor: '#DAA520' }}
                        layoutId="active-pill"
                        transition={{ duration: 0.6, type: "spring" }}
                      />
                    )}
                    <link.icon className={`h-5 w-5 ${isActive ? 'text-amber-300' : ''}`} />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
}