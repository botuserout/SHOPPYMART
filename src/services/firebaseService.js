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
import { db } from '../firebase/config';
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

// Re-export Auth services from dedicated authService.js
export {
  fetchOrCreateUserProfile,
  loginWithGooglePopup,
  registerWithEmail,
  loginWithEmail,
  logoutUser,
  sendPasswordReset,
  // Alias mappings for backward compatibility
  loginWithEmail as loginUser,
  registerWithEmail as registerUser,
  loginWithGooglePopup as loginWithGoogle,
  sendPasswordReset as resetUserPassword
} from './authService';

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

  // Always save locally to localStorage first for instant fallback & offline availability
  const orders = getLS(LS_KEYS.ORDERS, []);
  const newLocalOrder = {
    id: formattedOrder.orderNumber || ('ord-' + Math.floor(100000 + Math.random() * 900000)),
    ...formattedOrder
  };
  orders.unshift(newLocalOrder);
  setLS(LS_KEYS.ORDERS, orders);

  // Background Firestore add with 1.2s fast timeout
  const firestoreAdd = (async () => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), formattedOrder);
      return { id: docRef.id, ...formattedOrder };
    } catch (err) {
      return newLocalOrder;
    }
  })();

  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(newLocalOrder), 1200));
  return await Promise.race([firestoreAdd, timeoutPromise]);
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
