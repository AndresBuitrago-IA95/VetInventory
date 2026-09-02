"use client";

import { useState, useEffect } from "react";
import { useSalesStore } from "@/lib/salesStore";
import { useInventoryStore } from "@/lib/inventoryStore";
import { useAuthStore } from "@/lib/authStore";
import { IconDollar, IconTrendingUp, IconReport, IconSales } from "@/components/Icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function ReportsPage() {
  const { sales, fetchSales } = useSalesStore();
  const { products, fetchProducts } = useInventoryStore();
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, [fetchSales, fetchProducts]);

  // Calculate financial summary
  const financialSummary = calculateFinancialSummary(sales);

  // Prepare data for charts
  const monthlyData = prepareMonthlyData(sales);
  const categoryData = prepareCategoryData(sales);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Finanzas</h1>
        <p className="text-gray-600">Análisis de ventas y ganancias</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Ingresos Totales"
          value={`$${financialSummary.totalRevenue.toLocaleString()}`}
          icon={IconDollar}
          color="text-green-600"
          bg="bg-green-100"
        />
        <SummaryCard
          title="Ventas Totales"
          value={financialSummary.salesCount.toString()}
          icon={IconSales}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <SummaryCard
          title="Venta Promedio"
          value={`$${financialSummary.averageSale.toFixed(2)}`}
          icon={IconTrendingUp}
          color="text-purple-600"
          bg="bg-purple-100"
        />
        <SummaryCard
          title="Productos Vendidos"
          value={products.length.toString()}
          icon={IconReport}
          color="text-orange-600"
          bg="bg-orange-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ingresos por Mes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventas por Categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {(categoryData as CategoryData[]).map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700 flex-1">{entry.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  ${entry.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Registro de Ventas</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rango de tiempo:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.slice(0, 20).map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.createdAt?.toString() || "").toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.items.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.paymentMethod === "cash"
                        ? "bg-green-100 text-green-800"
                        : sale.paymentMethod === "card"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {getPaymentMethodName(sale.paymentMethod)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sales.length === 0 && (
          <div className="text-center py-12">
            <IconReport className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay ventas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function calculateFinancialSummary(sales: any[]) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSalesCount = sales.length;
  const averageSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

  return {
    totalRevenue,
    salesCount: totalSalesCount,
    averageSale,
  };
}

function prepareMonthlyData(sales: any[]) {
  const monthlyData: any[] = {};
  sales.forEach((sale) => {
    const date = new Date(sale.createdAt?.toString() || "");
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, revenue: 0 };
    }
    monthlyData[monthKey].revenue += sale.totalAmount;
  });

  return Object.values(monthlyData).slice(-12); // Last 12 months
}

interface CategoryData {
  name: string;
  value: number;
}

function prepareCategoryData(sales: any[]): CategoryData[] {
  const categoryData: Record<string, CategoryData> = {};
  sales.forEach((sale) => {
    sale.items.forEach((item: any) => {
      // Extract category from product name or use "General"
      const category = item.productName.split(" ")[0] || "General";
      if (!categoryData[category]) {
        categoryData[category] = { name: category, value: 0 };
      }
      categoryData[category].value += item.subtotal;
    });
  });

  return Object.values(categoryData).slice(0, 5); // Top 5 categories
}

function getPaymentMethodName(method: string) {
  const methods: any = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
    mixed: "Mixto",
  };
  return methods[method] || method;
}

function SummaryCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}
