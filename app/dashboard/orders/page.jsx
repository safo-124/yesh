'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MoreVertical } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    const toastId = toast.loading("Updating order status...");
    try {
        const response = await fetch(`/api/admin-orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("Failed to update status.");
        
        toast.success("Order status updated!", { id: toastId });
        fetchOrders(); // Refresh the list
    } catch (error) {
        toast.error(error.message, { id: toastId });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    }
  };

  // ... (animation variants remain the same)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
          Customer Orders
        </h1>
        <p className="text-muted-foreground">View and manage all incoming orders.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading orders...</p>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <motion.div key={order.id} layout>
                <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row justify-between items-start bg-gray-100 p-4">
                      <div className="flex-1">
                          <CardTitle className="text-base">Order #{order.id.substring(0, 8)}</CardTitle>
                          <CardDescription>By: {order.user.name}</CardDescription>
                          <div className="mt-2">{getStatusBadge(order.status)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="text-right">
                              <p className="font-bold text-lg">{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(order.totalPrice)}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('en-GH')}</p>
                          </div>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}>
                                      Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="text-red-600 focus:text-red-600">
                                      Cancel Order
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
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