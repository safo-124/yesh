'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ReviewDialog } from '@/components/customer/ReviewDialog';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewItem, setReviewItem] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { status } = useSession();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/my-orders');
      if (!response.ok) {
        throw new Error('Could not fetch orders.');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
    if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleOpenReviewDialog = (item) => {
    setReviewItem(item);
    setIsReviewDialogOpen(true);
  };

  if (status === 'loading' || loading) {
    return <div className="text-center py-20">Loading your orders...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-20">Please log in to view your orders.</div>;
  }

  return (
    <>
      <div className="bg-gray-50/50 min-h-screen py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold tracking-tight text-center mb-8" style={{ color: '#8B4513' }}>
              My Orders
            </h1>
          </motion.div>

          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground">You haven't placed any orders yet.</p>
          ) : (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                  hidden: { opacity: 0 },
                  visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                  }
              }}
            >
              {orders.map((order) => (
                <motion.div key={order.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                  <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-100 p-4">
                      <div>
                          <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                          <CardDescription>
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-GH', { dateStyle: 'long' })}
                          </CardDescription>
                      </div>
                      <div className="mt-2 sm:mt-0">
                          <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'} className={order.status === 'COMPLETED' ? 'bg-green-600' : ''}>
                              {order.status}
                          </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                          {order.items.map(item => (
                              <div key={item.id} className="flex items-center gap-4">
                                  <Image src={item.menuItem.imageUrl} alt={item.menuItem.name} width={64} height={64} className="rounded-md object-cover" />
                                  <div className="flex-1">
                                      <p className="font-semibold">{item.menuItem.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                          {item.quantity} x {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price)}
                                      </p>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => handleOpenReviewDialog(item.menuItem)}>
                                      Leave Review
                                  </Button>
                              </div>
                          ))}
                      </div>
                      <div className="text-right font-bold text-lg mt-4 pt-4 border-t">
                          Total: {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(order.totalPrice)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* The Review Dialog */}
      {reviewItem && (
        <ReviewDialog
          isOpen={isReviewDialogOpen}
          setIsOpen={setIsReviewDialogOpen}
          item={reviewItem}
        />
      )}
    </>
  );
}