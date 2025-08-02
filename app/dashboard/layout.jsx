import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col" style={{ backgroundColor: '#F5F5F5' }}>
        <MobileNav />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}