'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, Info, Image as ImageIcon, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UserNav from './UserNav';
import CartButton from './CartButton';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-[#A0522D] shadow-md h-20' : 'bg-transparent h-24'
      }`}
    >
      <div className="container flex h-full items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden w-14 h-14 relative border-2 border-amber-200 shadow-md">
              <Image src="/logo.jpg" alt="Gloryland Logo" fill className="object-cover" />
            </div>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-2">
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Button variant="ghost" asChild className="text-gray-200 font-semibold text-base">
                    <Link href="/menu">Our Menu</Link>
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
                <DropdownMenuContent className="w-56 bg-[#8B4513] border-[#A0522D]">
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

        <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="hidden sm:flex">
                <Button asChild className="font-bold bg-amber-500 text-[#442c14] hover:bg-amber-600">
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
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                    <motion.div whileTap={{ scale: 0.9 }}><Button variant="ghost" size="icon" className="text-white hover:bg-white/10"><Menu /></Button></motion.div>
                </SheetTrigger>
                <SheetContent side="right" className="text-white pt-10" style={{ backgroundColor: '#8B4513' }}>
                  {/* Mobile Menu Content Here */}
                </SheetContent>
              </Sheet>
            </div>
        </motion.div>
      </div>
    </header>
  );
}