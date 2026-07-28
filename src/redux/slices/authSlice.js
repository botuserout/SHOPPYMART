import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  registerUser, 
  loginUser, 
  loginWithGoogle,
  getGoogleRedirectResult,
  logoutUser, 
  resetUserPassword 
} from '../../services/firebaseService';

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

/**
 * Initiates Google Sign-In via redirect. Browser navigates away immediately —
 * the auth result is consumed on the next page load via googleRedirectResultThunk.
 */
export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      await loginWithGoogle();
      return null; // Browser navigates away before this resolves
    } catch (err) {
      return rejectWithValue(err.message || 'Google Login failed');
    }
  }
);

/**
 * Called on app startup to consume any pending Google redirect result.
 * Returns user data if the user just returned from Google auth, otherwise null.
 */
export const googleRedirectResultThunk = createAsyncThunk(
  'auth/googleRedirectResult',
  async (_, { rejectWithValue }) => {
    try {
      return await getGoogleRedirectResult();
    } catch (err) {
      return rejectWithValue(err.message || 'Google redirect check failed');
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
    user: null,
    isLoading: false,
    isRedirectPending: false, // True while checking for redirect result on startup
    error: null,
    isInitialized: false
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
        state.isInitialized = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Email Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Google Redirect Initiation (browser navigates away — no user returned)
      .addCase(googleLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state) => {
        // Browser has navigated to Google — loading stays true until redirect returns
        state.isLoading = false;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Google Redirect Result (called on page load after returning from Google)
      .addCase(googleRedirectResultThunk.pending, (state) => {
        state.isRedirectPending = true;
      })
      .addCase(googleRedirectResultThunk.fulfilled, (state, action) => {
        state.isRedirectPending = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload; // Only set if a redirect actually completed
        }
      })
      .addCase(googleRedirectResultThunk.rejected, (state) => {
        state.isRedirectPending = false;
        state.isInitialized = true;
      })

      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isInitialized = true;
      });
  }
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
