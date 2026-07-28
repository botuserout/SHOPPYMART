import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
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
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { initialProducts, initialCategories, sampleUsers } from '../utils/seedData';

// Local storage key constants for fallback mode
const LS_KEYS = {
  PRODUCTS: 'skymart_mock_products',
  CATEGORIES: 'skymart_mock_categories',
  ORDERS: 'skymart_mock_orders',
  USERS: 'skymart_mock_users',
  CURRENT_USER: 'skymart_mock_current_user',
  CART: 'skymart_mock_cart',
  WISHLIST: 'skymart_mock_wishlist',
};

// Local storage helper
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

// Initialize Mock Data if missing
if (!getLS(LS_KEYS.PRODUCTS)) setLS(LS_KEYS.PRODUCTS, initialProducts);
if (!getLS(LS_KEYS.CATEGORIES)) setLS(LS_KEYS.CATEGORIES, initialCategories);
if (!getLS(LS_KEYS.USERS)) setLS(LS_KEYS.USERS, sampleUsers);
if (!getLS(LS_KEYS.ORDERS)) setLS(LS_KEYS.ORDERS, []);

// ==================== AUTHENTICATION SERVICES ====================

export const registerUser = async ({ email, password, displayName }) => {
  if (isFirebaseConfigured) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    await sendEmailVerification(user).catch(err => console.warn('Verification email error:', err));
    
    // Update display name
    await updateProfile(user, { displayName });

    // Store user document in Firestore `users` collection
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || email.split('@')[0],
      photoURL: user.photoURL || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } else {
    // Fallback Mock Register
    const mockUsers = getLS(LS_KEYS.USERS, sampleUsers);
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists.');
    }
    
    const newUser = {
      uid: 'user-' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    setLS(LS_KEYS.USERS, mockUsers);
    setLS(LS_KEYS.CURRENT_USER, newUser);
    return newUser;
  }
};

export const loginUser = async ({ email, password }) => {
  if (isFirebaseConfigured) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData = userDoc.exists() ? userDoc.data() : null;

    if (!userData) {
      userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }

    return userData;
  } else {
    // Fallback Mock Login
    const mockUsers = getLS(LS_KEYS.USERS, sampleUsers);
    // Special admin login shortcut for easy demoing
    if (email === 'admin@skymart.com') {
      const admin = mockUsers.find(u => u.role === 'admin') || sampleUsers[0];
      setLS(LS_KEYS.CURRENT_USER, admin);
      return admin;
    }

    let existingUser = mockUsers.find(u => u.email === email);
    if (!existingUser) {
      existingUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        photoURL: '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      mockUsers.push(existingUser);
      setLS(LS_KEYS.USERS, mockUsers);
    }
    setLS(LS_KEYS.CURRENT_USER, existingUser);
    return existingUser;
  }
};

export const loginWithGoogle = async () => {
  if (isFirebaseConfigured) {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let userData;
    if (userDoc.exists()) {
      userData = userDoc.data();
    } else {
      userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userData);
    }
    return userData;
  } else {
    // Fallback Google Login
    const mockUser = {
      uid: 'google-user-' + Date.now(),
      email: 'alex.google@example.com',
      displayName: 'Alex (Google Auth)',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setLS(LS_KEYS.CURRENT_USER, mockUser);
    return mockUser;
  }
};

export const logoutUser = async () => {
  if (isFirebaseConfigured) {
    await signOut(auth);
  }
  localStorage.removeItem(LS_KEYS.CURRENT_USER);
};

export const resetUserPassword = async (email) => {
  if (isFirebaseConfigured) {
    await sendPasswordResetEmail(auth, email);
  }
  return true;
};

// ==================== PRODUCTS SERVICES ====================

export const fetchProductsFromDb = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products.length > 0 ? products : initialProducts;
    } catch (err) {
      console.warn('Firestore fetch products failed, using seed data:', err);
      return getLS(LS_KEYS.PRODUCTS, initialProducts);
    }
  }
  return getLS(LS_KEYS.PRODUCTS, initialProducts);
};

export const createProductInDb = async (productData) => {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...productData };
  } else {
    const products = getLS(LS_KEYS.PRODUCTS, initialProducts);
    const newProduct = {
      id: 'prod-' + Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    setLS(LS_KEYS.PRODUCTS, products);
    return newProduct;
  }
};

export const updateProductInDb = async (productId, productData) => {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'products', productId), productData);
    return { id: productId, ...productData };
  } else {
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
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, 'products', productId));
  } else {
    const products = getLS(LS_KEYS.PRODUCTS, initialProducts);
    const filtered = products.filter(p => p.id !== productId);
    setLS(LS_KEYS.PRODUCTS, filtered);
  }
  return productId;
};

// ==================== CATEGORIES SERVICES ====================

export const fetchCategoriesFromDb = async () => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const cats = [];
      snap.forEach(doc => cats.push({ id: doc.id, ...doc.data() }));
      return cats.length > 0 ? cats : initialCategories;
    } catch (e) {
      return getLS(LS_KEYS.CATEGORIES, initialCategories);
    }
  }
  return getLS(LS_KEYS.CATEGORIES, initialCategories);
};

export const createCategoryInDb = async (categoryData) => {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return { id: docRef.id, ...categoryData };
  } else {
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

  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'orders'), formattedOrder);
    return { id: docRef.id, ...formattedOrder };
  } else {
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
  if (isFirebaseConfigured) {
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
      console.warn('Fetch orders error:', err);
    }
  }

  const allOrders = getLS(LS_KEYS.ORDERS, []);
  if (isAdmin) return allOrders;
  return allOrders.filter(o => o.userId === userId || !o.userId);
};

export const updateOrderStatusInDb = async (orderId, newStatus) => {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
  } else {
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
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = [];
      snap.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      return users;
    } catch (e) {
      return getLS(LS_KEYS.USERS, sampleUsers);
    }
  }
  return getLS(LS_KEYS.USERS, sampleUsers);
};

export const updateUserRoleInDb = async (userId, newRole) => {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  } else {
    const users = getLS(LS_KEYS.USERS, sampleUsers);
    const index = users.findIndex(u => u.uid === userId || u.id === userId);
    if (index !== -1) {
      users[index].role = newRole;
      setLS(LS_KEYS.USERS, users);
    }
  }
  return { userId, newRole };
};
