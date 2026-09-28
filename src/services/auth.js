import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const resetPassword = (email, languageCode = "en") => {
  auth.languageCode = languageCode;
  return sendPasswordResetEmail(auth, email);
};

export const logoutUser = () => signOut(auth);
