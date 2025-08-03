'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin-orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders. You may not have permission.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
          Customer Orders
        </h1>
        <p className="text-muted-foreground">View and manage all incoming orders.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading orders...</p>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div key={order.id} variants={cardVariants} layout>
                <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row justify-between items-center bg-gray-100 p-4">
                      <div>
                          <CardTitle className="text-base">Order #{order.id.substring(0, 8)}</CardTitle>
                          <CardDescription>By: {order.user.name}</CardDescription>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-lg">{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(order.totalPrice)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('en-GH')}</p>
                      </div>
                  </CardHeader>
                  <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Items</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {order.items.map(item => (
                              <li key={item.id}>
                                  {item.quantity} x {item.menuItem.name}
                              </li>
                          ))}
                      </ul>
                       <div className="text-right mt-4">
                         <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {order.status}
                        </Badge>
                       </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-8">
              No orders found.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}