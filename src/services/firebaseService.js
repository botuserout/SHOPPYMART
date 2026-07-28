import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { initialProducts, initialCategories, sampleUsers } from '../utils/seedData';

// Local storage key constants (used as a graceful fallback when Firestore is blocked by ad-blockers)
const LS_KEYS = {
  PRODUCTS: 'skymart_mock_products',
  CATEGORIES: 'skymart_mock_categories',
  ORDERS: 'skymart_mock_orders',
  USERS: 'skymart_mock_users',
  CURRENT_USER: 'skymart_mock_current_user',
  CART: 'skymart_mock_cart',
  WISHLIST: 'skymart_mock_wishlist',
};

const getLS = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// Initialize seed data if missing
if (!getLS(LS_KEYS.PRODUCTS)) setLS(LS_KEYS.PRODUCTS, initialProducts);
if (!getLS(LS_KEYS.CATEGORIES)) setLS(LS_KEYS.CATEGORIES, initialCategories);
if (!getLS(LS_KEYS.USERS)) setLS(LS_KEYS.USERS, sampleUsers);
if (!getLS(LS_KEYS.ORDERS)) setLS(LS_KEYS.ORDERS, []);

// ==================== AUTHENTICATION SERVICES ====================

export const registerUser = async ({ email, password, displayName }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Send email verification
  await sendEmailVerification(user).catch(err => console.warn('Verification email error:', err));

  // Update display name in Firebase Auth profile
  await updateProfile(user, { displayName });

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || email.split('@')[0],
    photoURL: user.photoURL || '',
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', user.uid), userData);
  } catch (err) {
    console.warn('Firestore write blocked (ad-blocker?), saving locally:', err.message);
    const mockUsers = getLS(LS_KEYS.USERS, []);
    mockUsers.push(userData);
    setLS(LS_KEYS.USERS, mockUsers);
  }

  return userData;
};

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) return userDoc.data();

    // First-time login: create doc
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } catch (err) {
    console.warn('Firestore read blocked (ad-blocker?), using Firebase Auth data:', err.message);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  }
};

/**
 * Initiates Google Sign-In using redirect flow.
 * Avoids COOP/popup-blocking issues entirely.
 * The result is consumed on the next page load via getGoogleRedirectResult().
 */
export const loginWithGoogle = async () => {
  await signInWithRedirect(auth, googleProvider);
  // Browser navigates away — this line is never reached
};

/**
 * Called on app startup to check if the user just returned from a Google redirect.
 * Returns user data if a redirect just completed, or null if no pending redirect.
 */
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null; // No redirect was pending

    const user = result.user;
    const userDocRef = doc(db, 'users', user.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) return userDoc.data();

      // New Google user — create Firestore doc
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userData);
      return userData;
    } catch (firestoreErr) {
      console.warn('Firestore blocked (ad-blocker?), returning Firebase Auth data:', firestoreErr.message);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
    }
  } catch (err) {
    // Ignore "no redirect" errors silently
    if (err.code === 'auth/no-auth-event') return null;
    console.warn('getRedirectResult error:', err.message);
    return null;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem(LS_KEYS.CURRENT_USER);
};

export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  return true;
};

// ==================== PRODUCTS SERVICES ====================

export const fetchProductsFromDb = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products.length > 0 ? products : initialProducts;
  } catch (err) {
    console.warn('Firestore fetch products blocked/failed, using seed data:', err.message);
    return getLS(LS_KEYS.PRODUCTS, initialProducts);
  }
};

export const createProductInDb = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...productData };
  } catch (err) {
    console.warn('Firestore blocked, saving product locally:', err.message);
    const products = getLS(LS_KEYS.PRODUCTS, initialProducts);
    const newProduct = { id: 'prod-' + Date.now(), ...productData, createdAt: new Date().toISOString() };
    products.unshift(newProduct);
    setLS(LS_KEYS.PRODUCTS, products);
    return newProduct;
  }
};

export const updateProductInDb = async (productId, productData) => {
  try {
    await updateDoc(doc(db, 'products', productId), productData);
    return { id: productId, ...productData };
  } catch (err) {
    console.warn('Firestore blocked, updating product locally:', err.message);
    const products = getLS(LS_KEYS.PRODUCTS, initialProducts);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      setLS(LS_KEYS.PRODUCTS, products);
    }
    return { id: productId, ...productData };
  }
};

export const deleteProductFromDb = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.warn('Firestore blocked, deleting product locally:', err.message);
    const products = getLS(LS_KEYS.PRODUCTS, initialProducts);
    setLS(LS_KEYS.PRODUCTS, products.filter(p => p.id !== productId));
  }
  return productId;
};

// ==================== CATEGORIES SERVICES ====================

export const fetchCategoriesFromDb = async () => {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    const cats = [];
    snap.forEach(doc => cats.push({ id: doc.id, ...doc.data() }));
    return cats.length > 0 ? cats : initialCategories;
  } catch (err) {
    console.warn('Firestore blocked, using seed categories:', err.message);
    return getLS(LS_KEYS.CATEGORIES, initialCategories);
  }
};

export const createCategoryInDb = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return { id: docRef.id, ...categoryData };
  } catch (err) {
    console.warn('Firestore blocked, saving category locally:', err.message);
    const cats = getLS(LS_KEYS.CATEGORIES, initialCategories);
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      ...categoryData,
      count: 0
    };
    cats.push(newCat);
    setLS(LS_KEYS.CATEGORIES, cats);
    return newCat;
  }
};

// ==================== ORDERS SERVICES ====================

export const createOrderInDb = async (orderData) => {
  const formattedOrder = {
    ...orderData,
    status: 'Placed',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), formattedOrder);
    return { id: docRef.id, ...formattedOrder };
  } catch (err) {
    console.warn('Firestore blocked, saving order locally:', err.message);
    const orders = getLS(LS_KEYS.ORDERS, []);
    const newOrder = {
      id: 'ord-' + Math.floor(100000 + Math.random() * 900000),
      ...formattedOrder
    };
    orders.unshift(newOrder);
    setLS(LS_KEYS.ORDERS, orders);
    return newOrder;
  }
};

export const fetchOrdersFromDb = async (userId, isAdmin = false) => {
  try {
    let q;
    if (isAdmin) {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'orders'), where('userId', '==', userId));
    }
    const snap = await getDocs(q);
    const orders = [];
    snap.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
    return orders;
  } catch (err) {
    console.warn('Firestore blocked, reading orders locally:', err.message);
    const allOrders = getLS(LS_KEYS.ORDERS, []);
    if (isAdmin) return allOrders;
    return allOrders.filter(o => o.userId === userId || !o.userId);
  }
};

export const updateOrderStatusInDb = async (orderId, newStatus) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
  } catch (err) {
    console.warn('Firestore blocked, updating order locally:', err.message);
    const orders = getLS(LS_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      setLS(LS_KEYS.ORDERS, orders);
    }
  }
  return { orderId, newStatus };
};

// ==================== USERS & ROLES SERVICES ====================

export const fetchAllUsersFromDb = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users = [];
    snap.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    return users;
  } catch (err) {
    console.warn('Firestore blocked, reading users locally:', err.message);
    return getLS(LS_KEYS.USERS, sampleUsers);
  }
};

export const updateUserRoleInDb = async (userId, newRole) => {
  try {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  } catch (err) {
    console.warn('Firestore blocked, updating role locally:', err.message);
    const users = getLS(LS_KEYS.USERS, sampleUsers);
    const index = users.findIndex(u => u.uid === userId || u.id === userId);
    if (index !== -1) {
      users[index].role = newRole;
      setLS(LS_KEYS.USERS, users);
    }
  }
  return { userId, newRole };
};
