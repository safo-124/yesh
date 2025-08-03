'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Calendar, Users, Settings, PanelLeft, ShoppingCart } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
    { href: '/dashboard/menu-management', label: 'Menu', icon: Utensils },
     { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/site-settings', label: 'Site Settings', icon: Settings },
  ];

  const sheetVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: '-100%', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <header 
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 shadow-sm md:hidden"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'saturate(180%) blur(5px)',
      }}
    >
      <Sheet>
        <SheetTrigger asChild>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button size="icon" variant="ghost">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </motion.div>
        </SheetTrigger>
        <AnimatePresence>
          <SheetContent 
            side="left" 
            className="sm:max-w-xs p-0" 
            // 👇 This is the updated style section
            style={{
                backgroundColor: 'rgba(139, 69, 19, 0.95)',
                backdropFilter: 'saturate(180%) blur(10px)',
            }}
            as={motion.div}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-4 py-6 text-lg font-medium text-white">
              <Link href="/" className="group flex h-12 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base">
                  <Image src="/logo.jpg" width={45} height={45} alt="logo" className="rounded-full border-2 border-amber-200" />
                  <span className="text-xl">Gloryland</span>
              </Link>
              {navLinks.map((link, i) => (
                   <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1 * i + 0.2 } }}
                   >
                    <Link
                        href={link.href}
                        className={`flex items-center gap-4 px-6 py-2 ${pathname === link.href ? 'text-amber-300 font-bold' : 'text-gray-300'} transition-colors duration-300 hover:text-amber-300 hover:bg-white/10`}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Link>
                   </motion.div>
              ))}
            </nav>
          </SheetContent>
        </AnimatePresence>
      </Sheet>
      
      <div className="font-semibold text-lg" style={{ color: '#8B4513' }}>
        Dashboard
      </div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
            <Image src={session?.user?.image || "/logo.jpg"} width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full" />
        </Button>
      </motion.div>
    </header>
  );
}