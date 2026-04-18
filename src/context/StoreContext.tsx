'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface StoreContextType {
  // Auth
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Simple login simulation
  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  return (
    <StoreContext.Provider value={{ 
      user, login, logout, 
      cart, addToCart, removeFromCart, updateQuantity, cartTotal 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
