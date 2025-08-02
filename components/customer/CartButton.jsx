'use client';

import { useState } from 'react';
import CartIcon from './CartIcon';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsCartOpen(true)}>
        <CartIcon />
      </div>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
}