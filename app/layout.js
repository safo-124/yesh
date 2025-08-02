import { Inter } from 'next/font/google'; // 1. Import Inter
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/components/providers/AuthProvider';

// 2. Initialize Inter instead of Geist
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gloryland Food & Pub Joint',
  description: 'Delicious food and easy bookings at Gloryland in Aburi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 3. Apply the new font className */}
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}