import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage or default to an empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Initialize cart item count state
  const [cartItemCount, setCartItemCount] = useState(0);

  // Update localStorage whenever the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Update the cartItemCount whenever the cart changes
  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        setCartItemCount((prevCount) => prevCount + 1);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.id === id);
      if (removedItem) {
        setCartItemCount((prevCount) => prevCount - removedItem.quantity);
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartItemCount(0);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, cartItemCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};