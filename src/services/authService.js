// ────────────────────────────────────────────────────────────
// LifeDrop — Auth Service (Email/Password — No SMS)
// ────────────────────────────────────────────────────────────
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// ── Sign Up ────────────────────────────────────────────────
export const signUp = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
};

// ── Sign In ────────────────────────────────────────────────
export const signIn = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// ── Password Reset ─────────────────────────────────────────
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// ── Sign Out ───────────────────────────────────────────────
export const logOut = () => signOut(auth);

// ── User Profile (Firestore) ───────────────────────────────
export const createOrUpdateUserProfile = async (user, profileData) => {
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);

  const data = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || profileData.name || '',
    ...profileData,
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  };

  await setDoc(userRef, data, { merge: true });
  return data;
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ── Auth State Listener ────────────────────────────────────
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
