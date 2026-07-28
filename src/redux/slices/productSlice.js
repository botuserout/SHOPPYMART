import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchProductsFromDb, 
  createProductInDb, 
  updateProductInDb, 
  deleteProductFromDb,
  fetchCategoriesFromDb,
  createCategoryInDb
} from '../../services/firebaseService';

export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsFromDb();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategoriesThunk = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesFromDb();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addProductThunk = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      return await createProductInDb(productData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateProductInDb(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteProductFromDb(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addCategoryThunk = createAsyncThunk(
  'products/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      return await createCategoryInDb(categoryData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    isLoading: false,
    error: null,
    
    // Filters & Sorting
    searchQuery: '',
    selectedCategory: 'all',
    priceRange: [0, 500],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
    currentPage: 1,
    itemsPerPage: 8
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      state.currentPage = 1;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
      state.currentPage = 1;
    },
    setInStockOnly: (state, action) => {
      state.inStockOnly = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.priceRange = [0, 500];
      state.minRating = 0;
      state.inStockOnly = false;
      state.sortBy = 'featured';
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Add Product
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update Product
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })

      // Delete Product
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })

      // Add Category
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  }
});

export const { 
  setSearchQuery, 
  setSelectedCategory, 
  setPriceRange, 
  setMinRating, 
  setInStockOnly, 
  setSortBy, 
  setCurrentPage, 
  resetFilters 
} = productSlice.actions;

export default productSlice.reducer;
