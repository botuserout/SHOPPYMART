import { createSlice } from '@reduxjs/toolkit';

const getSavedWishlist = () => {
  try {
    const saved = localStorage.getItem('skymart_wishlist_items');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getSavedWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item.id === product.id);
      
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('skymart_wishlist_items', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      localStorage.setItem('skymart_wishlist_items', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('skymart_wishlist_items');
    }
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
