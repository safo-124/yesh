'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const subtotalFormatted = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(subtotal);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error('Something went wrong during checkout.');
      }

      toast.success('Your order has been placed!');
      clearCart();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Your Order</SheetTitle>
          <SheetDescription>
            Review the items in your cart below before proceeding to checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="h-8 w-14"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="border-t bg-background p-6">
            <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>{subtotalFormatted}</span>
                </div>
                <Button 
                  className="w-full" 
                  style={{ backgroundColor: '#8B4513' }} 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Placing Order..." : "Place Order"}
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                    Clear Cart
                </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}