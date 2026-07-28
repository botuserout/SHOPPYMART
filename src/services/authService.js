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
 * Super-fast user profile fetch & sync.
 * Constructs instant profile from Auth user, checks cache, and races Firestore
 * with a fast 800ms timeout so UI transitions and auth NEVER stall.
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
  } catch (e) {
    // Ignore cache parse error
  }

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
      console.warn('Firestore profile sync timeout/error (using base profile):', e.message);
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
 * Authenticates user via Google Auth Popup instantly.
 */
export const loginWithGooglePopup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userProfile = await fetchOrCreateUserProfile(user);
  return userProfile;
};

/**
 * Registers new user with Email, Password, and Display Name.
 */
export const registerWithEmail = async ({ email, password, displayName }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Send verification email asynchronously without blocking
  sendEmailVerification(user).catch(err => 
    console.warn('Email verification send failed:', err.message)
  );

  // Update Firebase Auth display name
  if (displayName) {
    updateProfile(user, { displayName }).catch(() => {});
  }

  const userProfile = await fetchOrCreateUserProfile({
    ...user,
    displayName: displayName || user.displayName
  });

  return userProfile;
};

/**
 * Signs in user with Email and Password instantly.
 */
export const loginWithEmail = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const userProfile = await fetchOrCreateUserProfile(user);
  return userProfile;
};

/**
 * Signs out current user from Firebase Auth and clears local session cache.
 */
export const logoutUser = async () => {
  try {
    localStorage.removeItem('skymart_auth_user');
  } catch (e) {}
  await signOut(auth);
};

/**
 * Sends a password reset email to the specified email address.
 */
export const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
  return true;
};
