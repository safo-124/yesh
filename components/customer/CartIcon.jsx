'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

// We remove the onClick prop as it's handled by the parent CartButton
export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const [hasMounted, setHasMounted] = useState(false);

  // This useEffect ensures the component has "mounted" on the client
  // before we try to read from localStorage.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {/* Only render the count badge if the component has mounted */}
      {hasMounted && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </div>
  );
}