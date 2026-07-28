import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createOrderInDb, 
  fetchOrdersFromDb, 
  updateOrderStatusInDb 
} from '../../services/firebaseService';

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrderInDb(orderData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to place order');
    }
  }
);

export const fetchUserOrdersThunk = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ userId, isAdmin }, { rejectWithValue }) => {
    try {
      return await fetchOrdersFromDb(userId, isAdmin);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusInDb(orderId, newStatus);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [],
    adminOrders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    checkoutShippingAddress: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA'
    }
  },
  reducers: {
    setShippingAddress: (state, action) => {
      state.checkoutShippingAddress = { ...state.checkoutShippingAddress, ...action.payload };
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch User Orders
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
        state.adminOrders = action.payload;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, newStatus } = action.payload;
        const updateInList = (list) => {
          const item = list.find(o => o.id === orderId);
          if (item) item.status = newStatus;
        };
        updateInList(state.userOrders);
        updateInList(state.adminOrders);
      });
  }
});

export const { setShippingAddress, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
