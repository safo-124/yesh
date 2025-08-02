import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import UserNav from './UserNav';
import CartButton from './CartButton';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const navLinks = [
    { href: '/menu', label: 'Our Menu' },
    { href: '/booking', label: 'Book a Table' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: '#A0522D', borderColor: '#8B4513' }}>
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-brown-700 text-white" style={{ backgroundColor: '#8B4513' }}>
              <div className="grid gap-4 py-6">
                <Link href="/" className="flex justify-center mb-4">
                  <Image
                    src="/logo.jpg"
                    alt="Gloryland Logo"
                    width={150}
                    height={75}
                  />
                </Link>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-lg text-gray-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden md:flex items-center mr-6">
          <div className="rounded-full overflow-hidden w-12 h-12 relative border-2 border-amber-200">
             <Image
              src="/logo.jpg"
              alt="Gloryland Logo"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4 text-white">
          <CartButton />
          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild className="hover:bg-white/10 hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-white text-brown-600 hover:bg-gray-100">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}