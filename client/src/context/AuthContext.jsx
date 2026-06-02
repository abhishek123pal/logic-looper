// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "../utils/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Auth Actions ---
  const loginAsGuest = () => signInAnonymously(auth);
  const signup = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
  const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    loginAsGuest,
    signup,
    login,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);