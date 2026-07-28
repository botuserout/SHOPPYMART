import { createSlice } from '@reduxjs/toolkit';

const getSavedCart = () => {
  try {
    const saved = localStorage.getItem('skymart_cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  items: getSavedCart(),
  shippingCost: 9.99,
  freeShippingThreshold: 100,
  taxRate: 0.08, // 8%
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(item => item.product.id === product.id);

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity
        });
      }
      localStorage.setItem('skymart_cart_items', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      localStorage.setItem('skymart_cart_items', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('skymart_cart_items', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('skymart_cart_items');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartSubtotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export const selectCartShipping = (state) => {
  const subtotal = selectCartSubtotal(state);
  if (subtotal === 0 || subtotal >= state.cart.freeShippingThreshold) return 0;
  return state.cart.shippingCost;
};

export const selectCartTax = (state) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal * state.cart.taxRate;
};

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const shipping = selectCartShipping(state);
  const tax = selectCartTax(state);
  return subtotal + shipping + tax;
};

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
