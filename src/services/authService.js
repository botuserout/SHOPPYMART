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
  setDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

/**
 * Error classification helper for Firebase operations.
 */
export const classifyFirebaseError = (error) => {
  if (!error) return { type: 'UNKNOWN', message: 'An unknown error occurred.' };

  const msg = (error.message || '').toLowerCase();
  const code = (error.code || '').toLowerCase();

  if (msg.includes('blocked_by_client') || msg.includes('failed to fetch') || msg.includes('net::err')) {
    return {
      type: 'EXTENSION_BLOCKED',
      message: 'Network request intercepted by a browser extension (ad-blocker/privacy shield).'
    };
  }

  if (code.includes('permission-denied') || msg.includes('permission denied')) {
    return {
      type: 'PERMISSION_DENIED',
      message: 'Firestore Security Rules rejected the operation.'
    };
  }

  if (code.includes('unavailable') || msg.includes('offline') || msg.includes('network')) {
    return {
      type: 'NETWORK_OFFLINE',
      message: 'Network connection is offline or unstable.'
    };
  }

  return {
    type: 'FIREBASE_AUTH_ERROR',
    message: error.message || 'Firebase service error.'
  };
};

/**
 * Super-fast user profile fetch & sync with resilient fallback.
 */
export const fetchOrCreateUserProfile = async (user) => {
  if (!user || !user.uid) return null;

  // Instant profile derived directly from Firebase Auth user (< 1ms)
  const instantProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'SkyMart User'),
    photoURL: user.photoURL || '',
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  // Check fast local cache
  const cacheKey = `skymart_user_${user.uid}`;
  let baseProfile = instantProfile;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) baseProfile = JSON.parse(cached);
  } catch (e) {}

  // Background Firestore query
  const firestorePromise = (async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      } else {
        await setDoc(userDocRef, instantProfile);
        localStorage.setItem(cacheKey, JSON.stringify(instantProfile));
        return instantProfile;
      }
    } catch (e) {
      const errInfo = classifyFirebaseError(e);
      if (errInfo.type === 'EXTENSION_BLOCKED') {
        console.info('ℹ️ Firestore profile query handled by local cache (Ad-Blocker active).');
      } else {
        console.warn(`Firestore sync warning [${errInfo.type}]:`, errInfo.message);
      }
      return baseProfile;
    }
  })();

  // Race Firestore with a fast 800ms fallback for zero UI latency
  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(baseProfile), 800));

  const finalProfile = await Promise.race([firestorePromise, timeoutPromise]);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(finalProfile));
    localStorage.setItem('skymart_auth_user', JSON.stringify(finalProfile));
  } catch (e) {}

  return finalProfile;
};

/**
 * Authenticates user via Google Auth Popup.
 */
export const loginWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userProfile = await fetchOrCreateUserProfile(user);
    return userProfile;
  } catch (error) {
    const errInfo = classifyFirebaseError(error);
    throw new Error(errInfo.message);
  }
};

/**
 * Registers new user with Email, Password, and Display Name.
 */
export const registerWithEmail = async ({ email, password, displayName }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email asynchronously
    sendEmailVerification(user).catch(() => {});

    // Update Firebase Auth display name
    if (displayName) {
      updateProfile(user, { displayName }).catch(() => {});
    }

    const userProfile = await fetchOrCreateUserProfile({
      ...user,
      displayName: displayName || user.displayName
    });

    return userProfile;
  } catch (error) {
    const errInfo = classifyFirebaseError(error);
    throw new Error(errInfo.message);
  }
};

/**
 * Signs in user with Email and Password.
 */
export const loginWithEmail = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile = await fetchOrCreateUserProfile(user);
    return userProfile;
  } catch (error) {
    const errInfo = classifyFirebaseError(error);
    throw new Error(errInfo.message);
  }
};

/**
 * Signs out current user.
 */
export const logoutUser = async () => {
  try {
    localStorage.removeItem('skymart_auth_user');
  } catch (e) {}
  await signOut(auth);
};

/**
 * Sends password reset email.
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    const errInfo = classifyFirebaseError(error);
    throw new Error(errInfo.message);
  }
};
