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
 * Checks if a user document exists in Firestore `users/{uid}`.
 * If not found, creates the user document with default fields.
 * Returns the sanitized user profile object.
 */
export const fetchOrCreateUserProfile = async (user) => {
  if (!user || !user.uid) return null;

  const userDocRef = doc(db, 'users', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }

    // Default User Profile schema for Firestore `users/{uid}`
    const newUserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'SkyMart User'),
      photoURL: user.photoURL || '',
      role: 'customer', // Default role
      createdAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
  } catch (error) {
    console.warn('Firestore user profile fetch/create error (falling back to Auth object):', error.message);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'SkyMart User'),
      photoURL: user.photoURL || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  }
};

/**
 * Authenticates user via Google Auth Popup.
 * Synchronizes user profile to Firestore `users/{uid}`.
 */
export const loginWithGooglePopup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userProfile = await fetchOrCreateUserProfile(user);
  return userProfile;
};

/**
 * Registers new user with Email, Password, and Display Name.
 * Sends email verification, updates Firebase Auth profile, and writes user doc to Firestore.
 */
export const registerWithEmail = async ({ email, password, displayName }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Send verification email
  await sendEmailVerification(user).catch(err => 
    console.warn('Email verification send failed:', err.message)
  );

  // Update Firebase Auth display name
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  const userProfile = await fetchOrCreateUserProfile({
    ...user,
    displayName: displayName || user.displayName
  });

  return userProfile;
};

/**
 * Signs in user with Email and Password.
 * Synchronizes user profile from Firestore `users/{uid}`.
 */
export const loginWithEmail = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const userProfile = await fetchOrCreateUserProfile(user);
  return userProfile;
};

/**
 * Signs out current user from Firebase Auth.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Sends a password reset email to the specified email address.
 */
export const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
  return true;
};
