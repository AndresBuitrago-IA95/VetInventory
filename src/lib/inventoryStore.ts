import { create } from "zustand";
import { db } from "@/lib/firebase";
import { Product, ProductCategory } from "@/types";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

interface InventoryState {
  products: Product[];
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;

  // Product actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;

  // Category actions
  addCategory: (category: Omit<ProductCategory, "id" | "createdAt">) => Promise<void>;
  fetchCategories: () => Promise<void>;

  // Stock actions
  adjustStock: (productId: string, quantity: number) => Promise<void>;
  checkLowStock: () => Product[];
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      set({ products: productsList, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: "Error al cargar productos", isLoading: false });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const id = doc(collection(db, "products")).id;
      const product: Product = {
        ...productData,
        id,
        createdAt: serverTimestamp() as string,
        updatedAt: serverTimestamp() as string,
      };
      await setDoc(doc(db, "products", id), product);
      set((state) => ({ products: [...state.products, product] }));
    } catch (error) {
      console.error("Error adding product:", error);
      set({ error: "Error al agregar producto", isLoading: false });
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      await updateDoc(doc(db, "products", id), {
        ...productData,
        updatedAt: serverTimestamp() as string,
      });
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...productData } : p
        ),
      }));
    } catch (error) {
      console.error("Error updating product:", error);
      set({ error: "Error al actualizar producto", isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, "products", id));
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
      set({ error: "Error al eliminar producto", isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categoriesRef = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductCategory[];
      set({ categories: categoriesList, isLoading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: "Error al cargar categorías", isLoading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const id = doc(collection(db, "categories")).id;
      const category: ProductCategory = {
        ...categoryData,
        id,
        createdAt: serverTimestamp() as string,
      };
      await setDoc(doc(db, "categories", id), category);
      set((state) => ({ categories: [...state.categories, category] }));
    } catch (error) {
      console.error("Error adding category:", error);
      set({ error: "Error al agregar categoría", isLoading: false });
    }
  },

  adjustStock: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const product = get().products.find((p) => p.id === productId);
      if (!product) throw new Error("Producto no encontrado");

      const newStock = product.stock + quantity;
      if (newStock < 0) throw new Error("Stock insuficiente");

      await updateDoc(doc(db, "products", productId), {
        stock: newStock,
        updatedAt: serverTimestamp() as string,
      });

      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, stock: newStock } : p
        ),
      }));
    } catch (error) {
      console.error("Error adjusting stock:", error);
      set({ error: error instanceof Error ? error.message : "Error al adjustar stock", isLoading: false });
    }
  },

  checkLowStock: () => {
    const { products } = get();
    return products.filter((p) => p.stock <= p.minStock);
  },
}));
