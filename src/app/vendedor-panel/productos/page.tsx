"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, ExternalLink, Trash2, Edit, Package, Eye, EyeOff } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>(
    MOCK_PRODUCTS.filter((p) => p.vendorId === "ven_cafe_1")
  );

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const deleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Catálogo de Productos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra tus artículos publicados y su disponibilidad para pedidos por WhatsApp.
          </p>
        </div>

        <Link
          href="/vendedor-panel/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Publicar Producto</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-200">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block line-clamp-1">
                          {product.title}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          /{product.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {formatCurrency(Number(product.price))}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 0 ? (
                      <Badge variant="success">{product.stock} un</Badge>
                    ) : (
                      <Badge variant="danger">Agotado</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className="cursor-pointer"
                      title="Haz clic para cambiar estado"
                    >
                      {product.isActive ? (
                        <Badge variant="success" className="cursor-pointer">
                          <Eye className="h-3 w-3 mr-1" /> Visible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="cursor-pointer">
                          <EyeOff className="h-3 w-3 mr-1" /> Pausado
                        </Badge>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/producto/${product.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Ver en tienda"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
