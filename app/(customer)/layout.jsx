import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';

export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}