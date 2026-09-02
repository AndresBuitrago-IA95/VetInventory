import { redirect } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { IconTrendingUp, IconDollar, IconInventory, IconSales } from "@/components/Icons";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock data for demo
  const stats = [
    { name: "Ventas Totales", value: "$12,450", change: "+12.5%", icon: IconDollar, color: "bg-blue-100 text-blue-600" },
    { name: "Ingresos", value: "$8,320", change: "+8.2%", icon: IconTrendingUp, color: "bg-green-100 text-green-600" },
    { name: "Productos", value: "156", change: "+3", icon: IconInventory, color: "bg-purple-100 text-purple-600" },
    { name: "Ventas Hoy", value: "24", change: "+5", icon: IconSales, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-600">Resumen general de tu veterinaria</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} vs mes anterior
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ventas Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <IconSales className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Venta #{1000 + i}</p>
                      <p className="text-xs text-gray-500">Hace {i} horas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(Math.random() * 500 + 50).toFixed(2)}</p>
                    <p className="text-xs text-green-600">Completado</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <a href="/sales" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todas las ventas
            </a>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start p-3 bg-red-50 rounded-lg">
                  <IconAlert className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Medicina Vital</p>
                    <p className="text-xs text-red-600 mt-1">Stock bajo: {i * 3} unidades restantes</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/inventory" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver inventario completo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
