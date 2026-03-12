/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DBProduct, DBProductVariant } from '@/hooks/useProducts';

interface CartItem {
  product: DBProduct;
  variant?: DBProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: DBProduct, variant?: DBProductVariant) => void;
  removeFromCart: (productId: string, variant?: DBProductVariant) => void;
  updateQuantity: (productId: string, quantity: number, variant?: DBProductVariant) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'nyalix_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err);
      }
    }
  }, [items, isHydrated]);

  const addToCart = (product: DBProduct, variant?: DBProductVariant) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.variant?.id === variant?.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.variant?.id === variant?.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, variant?: DBProductVariant) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.variant?.id === variant?.id)));
  };

  const updateQuantity = (productId: string, quantity: number, variant?: DBProductVariant) => {
    if (quantity <= 0) { removeFromCart(productId, variant); return; }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.variant?.id === variant?.id ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
