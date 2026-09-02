import { create } from "zustand";
import { User } from "@/types";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: { ...userData, id: firebaseUser.uid } });
      } else {
        set({
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || email.split("@")[0],
            role: "staff",
            createdAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name,
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      set({ user: userData });
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  updateUser: async (userData: Partial<User>) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), userData);
      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      }));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  checkAuthStatus: async () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            set({
              user: { ...userDoc.data(), id: firebaseUser.uid } as User,
              isLoading: false,
            });
          } else {
            set({
              user: {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || firebaseUser.email!.split("@")[0],
                role: "staff",
                createdAt: new Date().toISOString(),
              },
              isLoading: false,
            });
          }
        } else {
          set({ user: null, isLoading: false });
        }
        unsubscribe();
        resolve();
      });
    });
  },
}));
