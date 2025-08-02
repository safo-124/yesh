import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);

        if (existingItem) {
          // Increment quantity
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
          toast.success(`${item.name} quantity updated in cart.`);
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
          toast.success(`${item.name} added to cart.`);
        }
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
        toast.error("Item removed from cart.");
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
            get().removeItem(itemId);
        } else {
            set(state => ({
                items: state.items.map(i => i.id === itemId ? { ...i, quantity } : i)
            }));
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
    }
  )
);