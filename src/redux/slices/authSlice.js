import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  registerUser, 
  loginUser, 
  loginWithGoogle, 
  logoutUser, 
  resetUserPassword 
} from '../../services/firebaseService';

// Initialize user state from LocalStorage if mock mode active
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('skymart_mock_current_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      return await registerUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      return await loginWithGoogle();
    } catch (err) {
      return rejectWithValue(err.message || 'Google Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return null;
    } catch (err) {
      return rejectWithValue(err.message || 'Logout failed');
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await resetUserPassword(email);
      return true;
    } catch (err) {
      return rejectWithValue(err.message || 'Reset password request failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getSavedUser(),
    isLoading: false,
    error: null,
    isInitialized: true
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Google Login
      .addCase(googleLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
