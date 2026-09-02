"use client";

import { useState, useEffect } from "react";
import { useSalesStore } from "@/lib/salesStore";
import { useInventoryStore } from "@/lib/inventoryStore";
import { useAuthStore } from "@/lib/authStore";
import { IconSearch, IconPlus, IconMinus, IconTrash, IconDollar, IconSales, IconAlert } from "@/components/Icons";

export default function SalesPage() {
  const { sales, currentSaleItems, addToCart, removeFromCart, updateCartQuantity, clearCart, createSale } = useSalesStore();
  const { products, fetchProducts } = useInventoryStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | "mixed">("cash");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      alert("No hay stock disponible");
      return;
    }
    addToCart(product, 1);
  };

  const handleCheckout = async () => {
    if (currentSaleItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!customerName) {
      alert("Ingresa el nombre del cliente");
      return;
    }

    try {
      await createSale(customerId, customerName, paymentMethod);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCustomerId("");
        setCustomerName("");
        setPaymentMethod("cash");
      }, 3000);
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Product Search */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Punto de Venta</h1>
          <p className="text-gray-600">Busca productos y agrega al carrito</p>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                product.stock <= 0
                  ? "bg-gray-100 border-gray-200 opacity-50"
                  : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
              onClick={() => handleAddToCart(product)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                <span className={`text-xs font-medium ${product.stock <= 0 ? "text-red-600" : "text-gray-500"}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3 truncate">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                {product.stock > 0 && (
                  <span className="text-xs text-blue-600 font-medium flex items-center">
                    <IconPlus className="w-3 h-3 mr-1" />
                    Agregar
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <IconSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="lg:w-96 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <IconSales className="w-5 h-5 mr-2" />
              Carrito de Compras
              {currentSaleItems.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {currentSaleItems.length}
                </span>
              )}
            </h2>
          </div>

          {/* Customer Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
                <option value="mixed">Mixto</option>
              </select>
            </div>
          </div>

          {/* Cart Items */}
          <div className="max-h-[400px] overflow-y-auto">
            {currentSaleItems.length === 0 ? (
              <div className="p-8 text-center">
                <IconSales className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">El carrito está vacío</p>
                <p className="text-sm text-gray-400 mt-2">Agrega productos del inventario</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentSaleItems.map((item) => (
                  <div key={item.productId} className="p-4 flex items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded"
                        >
                          <IconMinus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-700 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded"
                        >
                          <IconPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${useSalesStore.getState().cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (16%)</span>
                <span className="font-medium text-gray-900">${useSalesStore.getState().cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">${useSalesStore.getState().cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={currentSaleItems.length === 0}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconDollar className="w-5 h-5 mr-2" />
              Realizar Venta
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
          <IconDollar className="w-5 h-5 mr-2" />
          <span className="font-medium">¡Venta completada exitosamente!</span>
        </div>
      )}

      {/* Recent Sales (Mobile only) */}
      <div className="lg:hidden mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ventas Recientes</h3>
          </div>
          <div className="p-4">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Venta #{sale.id.substring(0, 8)}</p>
                  <p className="text-xs text-gray-500">{sale.customerName}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">${sale.totalAmount.toFixed(2)}</span>
              </div>
            ))}
            {sales.length === 0 && <p className="text-gray-500 text-sm">Sin ventas registradas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
