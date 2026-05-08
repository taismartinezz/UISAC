"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Ask the server whether this user is an admin.
        // The server checks ADMIN_EMAILS — the list is never sent to the client.
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch("/api/check-admin", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setIsAdmin(data.isAdmin === true);

          // Store token in a cookie so Server Components can read it
          document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Strict`;
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        // Clear the cookie on sign-out
        document.cookie =
          "firebase-token=; path=/; max-age=0; SameSite=Strict";
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
