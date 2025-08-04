'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function POSPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        toast.error("Failed to load menu items.");
      }
    };
    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(i => i.id === item.id);
      if (existingItem) {
        return currentCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId));
  };
  
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/pos-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart),
        });
        if (!response.ok) throw new Error("Failed to place order.");
        toast.success("Walk-in order created successfully!");
        setCart([]); // Clear cart
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
      {/* Menu Items Grid */}
      <div className="lg:col-span-2">
        <Card className="h-full">
            <CardHeader><CardTitle>Menu</CardTitle></CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-15rem)]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {menuItems.filter(item => item.isAvailable).map(item => (
                            <button key={item.id} onClick={() => addToCart(item)} className="border rounded-lg p-2 text-center hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
                                <div className="relative w-full aspect-square">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-md" />
                                </div>
                                <p className="text-sm font-medium mt-2 truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price)}</p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>

      {/* Live Receipt / Cart */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
            <CardHeader><CardTitle>Current Order</CardTitle></CardHeader>
            <CardContent className="flex-1">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                   {cart.length === 0 ? (
                       <p className="text-center text-muted-foreground pt-10">Click on menu items to add them to the order.</p>
                   ) : (
                       <div className="space-y-2">
                           {cart.map(item => (
                               <div key={item.id} className="flex items-center text-sm">
                                   <span className="font-semibold">{item.quantity} x</span>
                                   <span className="flex-1 ml-2 truncate">{item.name}</span>
                                   <span className="font-mono">{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price * item.quantity)}</span>
                                   <button onClick={() => removeFromCart(item.id)} className="ml-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                               </div>
                           ))}
                       </div>
                   )}
                </ScrollArea>
            </CardContent>
            <div className="border-t p-4 space-y-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(subtotal)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Place Walk-in Order"}
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}