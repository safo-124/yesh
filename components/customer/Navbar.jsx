'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, ChevronDown, Info, Image as ImageIcon, Phone, CalendarCheck, ShoppingCart, PartyPopper } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UserNav from './UserNav';
import CartButton from './CartButton';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();

  const otherPages = [
    { title: "Our Story", href: "/about", icon: Info },
    { title: "Gallery", href: "/gallery", icon: ImageIcon },
    { title: "Contact Us", href: "/contact", icon: Phone },
  ];

  const navItemVariants = {
    hover: { scale: 1.1, color: "#FFFFFF" },
    tap: { scale: 0.95 },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: '#A0522D', borderColor: '#8B4513' }}>
      <div className="container flex h-20 items-center justify-between">
        {/* Left Side: Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden w-14 h-14 relative border-2 border-amber-200 shadow-md">
              <Image src="/logo.jpg" alt="Gloryland Logo" fill className="object-cover" />
            </div>
            <span className="hidden sm:block font-bold text-xl text-white">Gloryland</span>
          </Link>
        </motion.div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Button variant="ghost" asChild className="text-gray-200 font-semibold text-base">
                    <Link href="/menu">Our Menu</Link>
                </Button>
            </motion.div>

            {/* ADDED "EVENTS" AS A MAIN LINK */}
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Button variant="ghost" asChild className="text-gray-200 font-semibold text-base">
                    <Link href="/events">Events</Link>
                </Button>
            </motion.div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                        <Button variant="ghost" className="text-gray-200 font-semibold text-base">
                            More <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" style={{ backgroundColor: '#8B4513', borderColor: '#A0522D' }}>
                    {otherPages.map(page => (
                        <DropdownMenuItem key={page.title} asChild>
                            <Link href={page.href} className="text-gray-200 focus:bg-white/10 focus:text-white">
                                <page.icon className="w-4 h-4 mr-2" />
                                {page.title}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>

        {/* Right Side: Actions & Mobile Menu */}
        <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="hidden sm:flex">
                <Button asChild className="font-bold" style={{ backgroundColor: '#DAA520', color: '#442c14' }}>
                    <Link href="/booking">Book a Table</Link>
                </Button>
            </div>
            <div className="text-white"><CartButton /></div>
            {session?.user ? (
                <UserNav user={session.user} />
            ) : (
                 <div className="hidden sm:flex">
                    <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            )}
            
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </motion.div>
                </SheetTrigger>
                <SheetContent side="right" className="text-white p-6 flex flex-col" style={{ backgroundColor: '#8B4513' }}>
                  <nav className="grid gap-6 text-lg font-medium mt-8">
                    <SheetClose asChild><Link href="/menu" className="flex items-center gap-2 hover:text-amber-300">Our Menu</Link></SheetClose>
                    <SheetClose asChild><Link href="/events" className="flex items-center gap-2 hover:text-amber-300"><PartyPopper className="h-5 w-5"/>Events</Link></SheetClose>
                    <SheetClose asChild><Link href="/about" className="flex items-center gap-2 hover:text-amber-300"><Info/>Our Story</Link></SheetClose>
                    <SheetClose asChild><Link href="/gallery" className="flex items-center gap-2 hover:text-amber-300"><ImageIcon/>Gallery</Link></SheetClose>
                    <SheetClose asChild><Link href="/contact" className="flex items-center gap-2 hover:text-amber-300"><Phone/>Contact</Link></SheetClose>
                    {session?.user && (
                        <>
                            <SheetClose asChild><Link href="/orders" className="flex items-center gap-2 hover:text-amber-300"><ShoppingCart/>My Orders</Link></SheetClose>
                            <SheetClose asChild><Link href="/bookings" className="flex items-center gap-2 hover:text-amber-300"><CalendarCheck/>My Bookings</Link></SheetClose>
                        </>
                    )}
                  </nav>

                  <div className="mt-auto space-y-4">
                    <SheetClose asChild>
                        <Button asChild className="w-full text-lg py-6 font-bold" style={{ backgroundColor: '#DAA520', color: '#442c14' }}>
                            <Link href="/booking">Book a Table</Link>
                        </Button>
                    </SheetClose>
                    {!session?.user && (
                        <SheetClose asChild>
                            <Button asChild className="w-full text-lg py-6 font-bold bg-white/10">
                                <Link href="/login">Login / Sign Up</Link>
                            </Button>
                        </SheetClose>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </motion.div>
      </div>
    </header>
  );
}