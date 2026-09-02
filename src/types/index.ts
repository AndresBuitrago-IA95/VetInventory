export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed";
  status: "completed" | "pending" | "cancelled";
  userId: string;
  userName: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface FinancialSummary {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  salesCount: number;
  averageSale: number;
  pendingPayments: number;
  monthlySales: MonthlySale[];
}

export interface MonthlySale {
  month: string;
  sales: number;
  revenue: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}
