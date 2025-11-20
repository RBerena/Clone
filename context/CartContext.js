// Import React, createContext, and useState for managing cart state
import React, { createContext, useState } from 'react';

// Create CartContext to share cart state and functions
export const CartContext = createContext();

// Provider component to wrap app and provide cart state & functions
export const CartProvider = ({ children }) => {
  // State to hold array of cart items (each with id and quantity)
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart: if already exists, increase quantity by 1; else add new item with quantity 1
  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item completely from cart by id
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Increase quantity of a specific item in cart by 1
  const increaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity of a specific item by 1; remove if quantity reaches 0
  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Provide cart items and all cart modifying functions to children components
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
