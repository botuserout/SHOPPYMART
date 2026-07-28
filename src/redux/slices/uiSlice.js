import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skymart_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const initialState = {
  darkMode: getInitialTheme(),
  isSearchModalOpen: false,
  isCartDrawerOpen: false,
  toastMessage: null, // { message: string, type: 'success' | 'error' | 'info' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('skymart_theme', state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('skymart_theme', action.payload ? 'dark' : 'light');
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    setSearchModalOpen: (state, action) => {
      state.isSearchModalOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.isCartDrawerOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toastMessage = {
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    clearToast: (state) => {
      state.toastMessage = null;
    }
  }
});

export const { 
  toggleDarkMode, 
  setDarkMode, 
  toggleSearchModal, 
  setSearchModalOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  showToast, 
  clearToast 
} = uiSlice.actions;

export default uiSlice.reducer;
