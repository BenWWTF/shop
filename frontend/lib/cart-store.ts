import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusaClient } from './medusa-client';

interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Cart {
  id: string | null;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
}

interface CartStore extends Cart {
  // Actions
  initCart: () => Promise<void>;
  addItem: (
    productId: string,
    variantId: string,
    title: string,
    price: number,
    quantity: number,
    image?: string
  ) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      id: null,
      items: [],
      total: 0,
      subtotal: 0,
      tax_total: 0,
      shipping_total: 0,

      initCart: async () => {
        try {
          const cart = await medusaClient.createCart();
          set({
            id: cart.id,
            items: cart.items || [],
            total: cart.total || 0,
            subtotal: cart.subtotal || 0,
            tax_total: cart.tax_total || 0,
            shipping_total: cart.shipping_total || 0,
          });
        } catch (error) {
          console.error('Error initializing cart:', error);
        }
      },

      addItem: async (
        productId: string,
        variantId: string,
        title: string,
        price: number,
        quantity: number,
        image?: string
      ) => {
        const { id } = get();

        if (!id) {
          // Create cart if doesn't exist
          const cart = await medusaClient.createCart();
          set({ id: cart.id });
          await get().addItem(productId, variantId, title, price, quantity, image);
          return;
        }

        try {
          const updatedCart = await medusaClient.addToCart(
            id,
            variantId,
            quantity
          );

          set({
            items: updatedCart.items || [],
            total: updatedCart.total || 0,
            subtotal: updatedCart.subtotal || 0,
            tax_total: updatedCart.tax_total || 0,
            shipping_total: updatedCart.shipping_total || 0,
          });
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      },

      removeItem: async (lineId: string) => {
        const { id } = get();

        if (!id) return;

        try {
          const updatedCart = await medusaClient.removeLineItem(id, lineId);

          set({
            items: updatedCart.items || [],
            total: updatedCart.total || 0,
            subtotal: updatedCart.subtotal || 0,
            tax_total: updatedCart.tax_total || 0,
            shipping_total: updatedCart.shipping_total || 0,
          });
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        const { id } = get();

        if (!id) return;

        try {
          const updatedCart = await medusaClient.updateLineItem(
            id,
            lineId,
            quantity
          );

          set({
            items: updatedCart.items || [],
            total: updatedCart.total || 0,
            subtotal: updatedCart.subtotal || 0,
            tax_total: updatedCart.tax_total || 0,
            shipping_total: updatedCart.shipping_total || 0,
          });
        } catch (error) {
          console.error('Error updating cart quantity:', error);
        }
      },

      clearCart: () => {
        set({
          id: null,
          items: [],
          total: 0,
          subtotal: 0,
          tax_total: 0,
          shipping_total: 0,
        });
      },

      getCartTotal: () => {
        return get().total;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'shop-cart',
      partialize: (state) => ({
        id: state.id,
        items: state.items,
      }),
    }
  )
);
