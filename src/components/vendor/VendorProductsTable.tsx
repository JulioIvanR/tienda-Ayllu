"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  ExternalLink,
  Trash2,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface VendorProductsTableProps {
  initialProducts: Product[];
  storeName: string;
}

export function VendorProductsTable({
  initialProducts,
  storeName,
}: VendorProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggleActive = async (product: Product) => {
    setBusyId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo cambiar el estado.");
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: !product.isActive } : p
        )
      );
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Error al actualizar el producto."
      );
    } finally {
      setBusyId(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
      return;
    }

    setBusyId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar el producto.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2e5e4e]">
            Catálogo de {storeName}
          </h1>
          <p className="mt-1 text-sm text-[#373737]/75">
            Administra tus artículos publicados y su disponibilidad para pedidos por WhatsApp.
          </p>
        </div>

        <Link
          href="/vendedor-panel/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-4 py-2.5 text-sm font-bold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Publicar Producto</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs">
        {products.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Package className="h-10 w-10 text-[#ca9029] mx-auto opacity-80" />
            <p className="text-sm font-semibold text-[#5d3805]">
              Tu tienda aún no tiene productos publicados.
            </p>
            <Link
              href="/vendedor-panel/productos/nuevo"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-4 py-2 text-xs font-bold"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publicar primer producto</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#373737]">
              <thead className="bg-[#f1e7d5] text-xs font-bold uppercase tracking-wider text-[#5d3805]">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd2be]">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#f1e7d5]/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#e8ded0] shrink-0 border border-[#dfd2be]">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-[#f1e7d5]">
                              <Package className="h-5 w-5 text-[#5d3805]/50" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#5d3805] block line-clamp-1">
                            {product.title}
                          </span>
                          <span className="text-xs text-[#373737]/60 font-mono">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-[#ca9029]">
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
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() => toggleActive(product)}
                        className="cursor-pointer disabled:opacity-50"
                        title="Haz clic para cambiar estado"
                      >
                        {product.isActive ? (
                          <Badge variant="success" className="cursor-pointer">
                            <Eye className="h-3 w-3 mr-1" /> Visible
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="cursor-pointer border-[#dfd2be]"
                          >
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
                          className="p-2 text-[#373737]/65 hover:text-[#ca9029] rounded-lg hover:bg-[#a8bca8]/20 transition-colors"
                          title="Ver en tienda"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === product.id}
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-[#373737]/65 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors disabled:opacity-50"
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
        )}
      </div>
    </div>
  );
}
