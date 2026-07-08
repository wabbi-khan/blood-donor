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
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

// ── Internal Email Helper ─────────────────────────────────
// Firebase Auth requires an email. We generate one from the username
// so users never need to see or type an email address.
export const usernameToEmail = (username) =>
  `${username.toLowerCase().trim()}@lifedrop.app`;

// ── Sign Up ────────────────────────────────────────────────
export const signUp = async (username, password, displayName) => {
  const email = usernameToEmail(username);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
};

// ── Username Helpers ────────────────────────────────────────
export const isUsernameTaken = async (username) => {
  if (!username) return false;
  const methods = await fetchSignInMethodsForEmail(auth, usernameToEmail(username));
  return methods.length > 0;
};

export const getEmailByUsername = async (username) => {
  if (!username) return null;
  try {
    const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data().email;
  } catch {
    // Fallback to generated email if Firestore query fails (e.g. no auth)
    return null;
  }
};

// ── Sign In ────────────────────────────────────────────────
export const signIn = async (usernameOrEmail, password) => {
  let email = usernameOrEmail;
  if (usernameOrEmail && !usernameOrEmail.includes('@')) {
    // It's a username — look up from Firestore first (handles existing accounts)
    // then fall back to the generated email pattern
    const resolvedEmail = await getEmailByUsername(usernameOrEmail);
    email = resolvedEmail || usernameToEmail(usernameOrEmail);
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// ── Google Sign In ─────────────────────────────────────────
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// ── Password Reset (by username) ───────────────────────────
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const resetPasswordByUsername = async (username) => {
  // Look up stored email first, then fall back to the generated pattern
  const resolvedEmail = await getEmailByUsername(username);
  const email = resolvedEmail || usernameToEmail(username);
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
    username: profileData.username?.toLowerCase() || (existing.exists() ? existing.data()?.username : '') || '',
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

// ── Update Password ────────────────────────────────────────
export const updateUserPassword = async (newPassword) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  } else {
    throw new Error("No user is currently logged in.");
  }
};
