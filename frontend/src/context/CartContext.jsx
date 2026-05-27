import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, api } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // 1. Initial Cart Load
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          // Retrieve persistent cart from database
          const { data } = await api.get('/api/cart');
          
          // Merge local cart (guest items) into backend cart if any exist
          const localCart = localStorage.getItem('guest_cart');
          if (localCart) {
            const guestItems = JSON.parse(localCart);
            if (guestItems.length > 0) {
              const mergedItems = mergeCarts(data.products || [], guestItems);
              
              // Sync merged cart back to server
              const syncData = mergedItems.map(item => ({
                product: item.product._id || item.product,
                quantity: item.quantity,
              }));
              const response = await api.post('/api/cart', { products: syncData });
              setCartItems(response.data.products || []);
            } else {
              setCartItems(data.products || []);
            }
            // Clear temporary local storage
            localStorage.removeItem('guest_cart');
          } else {
            setCartItems(data.products || []);
          }
        } catch (error) {
          console.error('Error loading backend cart:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode: load from localStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Utility to merge guest and account carts
  const mergeCarts = (dbItems, guestItems) => {
    const merged = [...dbItems];
    guestItems.forEach((guestItem) => {
      const dbItemIdx = merged.findIndex(
        (item) => item.product._id.toString() === guestItem.product._id.toString()
      );
      if (dbItemIdx > -1) {
        merged[dbItemIdx].quantity = Math.max(merged[dbItemIdx].quantity, guestItem.quantity);
      } else {
        merged.push(guestItem);
      }
    });
    return merged;
  };

  // 2. Synchronize changes to Database / LocalStorage
  const syncCartChanges = async (newItems) => {
    if (user) {
      try {
        const syncData = newItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        }));
        await api.post('/api/cart', { products: syncData });
      } catch (error) {
        console.error('Error syncing cart to backend:', error);
      }
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(newItems));
    }
  };

  // Add Item to Cart
  const addToCart = async (product, quantity = 1) => {
    const itemsCopy = [...cartItems];
    const existingIndex = itemsCopy.findIndex(
      (item) => item.product._id === product._id
    );

    if (existingIndex > -1) {
      const newQty = itemsCopy[existingIndex].quantity + quantity;
      // Cap at stock limits
      itemsCopy[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      itemsCopy.push({ product, quantity: Math.min(quantity, product.stock) });
    }

    setCartItems(itemsCopy);
    await syncCartChanges(itemsCopy);
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    const updated = cartItems.filter((item) => item.product._id !== productId);
    setCartItems(updated);
    await syncCartChanges(updated);
  };

  // Update Cart Quantity
  const updateQuantity = async (productId, quantity) => {
    const itemsCopy = [...cartItems];
    const itemIndex = itemsCopy.findIndex((item) => item.product._id === productId);

    if (itemIndex > -1) {
      const stockLimit = itemsCopy[itemIndex].product.stock;
      itemsCopy[itemIndex].quantity = Math.max(1, Math.min(quantity, stockLimit));
      
      setCartItems(itemsCopy);
      await syncCartChanges(itemsCopy);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    
    if (user) {
      try {
        await api.delete('/api/cart');
      } catch (error) {
        console.error('Error clearing backend cart:', error);
      }
    } else {
      localStorage.removeItem('guest_cart');
    }
  };

  // Apply Coupon Code
  const applyCoupon = (code) => {
    const upperCode = code.toUpperCase().trim();
    if (upperCode === 'SAVE20') {
      setCouponCode('SAVE20');
      setDiscountPercent(20);
      return { success: true, message: 'Coupon applied! 20% discount granted.' };
    }
    return { success: false, message: 'Invalid coupon code.' };
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  const discount = subtotal * (discountPercent / 100);
  
  // Free shipping over $250, otherwise flat $15.00
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 15.00;
  
  const total = subtotal - discount + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        discountPercent,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
