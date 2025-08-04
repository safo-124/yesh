'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Calendar, Users, Settings, BookUser, ShoppingCart, ImageIcon, ClipboardPenLine, PanelBottom, LayoutTemplate, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const allNavLinks = [
    { href: '/dashboard', label: 'Overview', icon: Home, roles: ['ADMIN', 'CASHIER'] },
    { href: '/dashboard/pos', label: 'Point of Sale', icon: ClipboardPenLine, roles: ['ADMIN', 'CASHIER'] },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar, roles: ['ADMIN', 'CASHIER'] },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, roles: ['ADMIN', 'CASHIER'] },
    { href: '/dashboard/events', label: 'Events', icon: PartyPopper, roles: ['ADMIN'] },
    { href: '/dashboard/menu-management', label: 'Menu', icon: Utensils, roles: ['ADMIN', 'CASHIER'] },
    { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon, roles: ['ADMIN'] },
    { href: '/dashboard/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
    { href: '/dashboard/about-management', label: 'About Page', icon: BookUser, roles: ['ADMIN'] },
    { href: '/dashboard/homepage-management', label: 'Homepage', icon: LayoutTemplate, roles: ['ADMIN'] }, // <-- ADD THIS
    { href: '/dashboard/footer-management', label: 'Footer', icon: PanelBottom, roles: ['ADMIN'] }, 
    { href: '/dashboard/site-settings', label: 'Site Settings', icon: Settings, roles: ['ADMIN'] },
  ];

  // Filter links based on the user's role
  const navLinks = allNavLinks.filter(link => userRole && link.roles.includes(userRole));

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const linkVariants = {
    hover: { scale: 1.05, x: 5, color: "#DAA520" },
    tap: { scale: 0.95 },
  };
  
  // Render nothing until the session is loaded to prevent a flicker
  if (!session) {
    return null; 
  }

  return (
    <motion.aside 
      className="hidden md:block w-64 flex-col text-white"
      style={{
        backgroundColor: 'rgba(139, 69, 19, 0.95)',
        backdropFilter: 'saturate(180%) blur(10px)',
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
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 transition-all relative',
                      isActive ? 'text-white font-bold' : 'text-gray-300'
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        className="absolute left-0 h-8 w-1 rounded-r-full" 
                        style={{ backgroundColor: '#DAA520' }}
                        layoutId="active-pill"
                        transition={{ duration: 0.6, type: "spring" }}
                      />
                    )}
                    <link.icon className={cn('h-5 w-5', isActive && 'text-amber-300')} />
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