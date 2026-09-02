import { create } from "zustand";
import { db } from "@/lib/firebase";
import { Sale, SaleItem } from "@/types";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

interface SalesState {
  sales: Sale[];
  currentSaleItems: SaleItem[];
  currentCustomerId: string;
  currentCustomerName: string;
  isLoading: boolean;
  error: string | null;

  // Cart actions
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Sale actions
  createSale: (customerId: string, customerName: string, paymentMethod: Sale["paymentMethod"]) => Promise<void>;
  fetchSales: (limitCount?: number) => Promise<void>;

  // Calculations
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  currentSaleItems: [],
  currentCustomerId: "",
  currentCustomerName: "",
  isLoading: false,
  error: null,

  // Cart actions
  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.currentSaleItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return {
          currentSaleItems: state.currentSaleItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        currentSaleItems: [
          ...state.currentSaleItems,
          {
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: product.price,
            subtotal: product.price * quantity,
          },
        ],
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      currentSaleItems: state.currentSaleItems.filter((item) => item.productId !== productId),
    }));
  },

  updateCartQuantity: (productId, quantity) => {
    set((state) => ({
      currentSaleItems: state.currentSaleItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ currentSaleItems: [] });
  },

  // Sale actions
  createSale: async (customerId, customerName, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const { currentSaleItems, cartTotal } = get();

      if (currentSaleItems.length === 0) {
        throw new Error("El carrito está vacío");
      }

      const sale: Sale = {
        id: doc(collection(db, "sales")).id,
        customerId,
        customerName,
        items: currentSaleItems,
        totalAmount: cartTotal,
        subtotal: cartTotal / 1.16, // Assuming 16% tax rate
        tax: cartTotal * 0.16,
        discount: 0,
        paymentMethod,
        status: "completed",
        userId: "", // Will be set from auth
        userName: "", // Will be set from auth
        createdAt: serverTimestamp() as string,
      };

      // Add sale to Firestore
      await setDoc(doc(db, "sales", sale.id), sale);

      // Update current sale with user info
      // In a real app, get this from auth context

      set({ sales: [sale, ...get().sales], currentSaleItems: [] });

      return sale;
    } catch (error) {
      console.error("Error creating sale:", error);
      set({ error: error instanceof Error ? error.message : "Error al crear la venta", isLoading: false });
      throw error;
    }
  },

  fetchSales: async (limitCount = 50) => {
    set({ isLoading: true, error: null });
    try {
      const salesRef = collection(db, "sales");
      const q = query(salesRef, orderBy("createdAt", "desc"), limit(limitCount));
      const salesSnapshot = await getDocs(q);
      const salesList = salesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[];
      set({ sales: salesList, isLoading: false });
    } catch (error) {
      console.error("Error fetching sales:", error);
      set({ error: "Error al cargar ventas", isLoading: false });
    }
  },

  // Calculations
  get cartSubtotal() {
    return get().currentSaleItems.reduce((sum, item) => sum + item.subtotal, 0);
  },

  get cartTax() {
    return get().cartSubtotal * 0.16;
  },

  get cartTotal() {
    return get().cartSubtotal + get().cartTax;
  },
}));
