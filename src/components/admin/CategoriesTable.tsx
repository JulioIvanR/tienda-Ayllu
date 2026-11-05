"use client";

import { useState } from "react";
import { Category, ApprovalStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, Plus, Tag, Sparkles } from "lucide-react";
import { slugify } from "@/lib/utils";

interface CategoriesTableProps {
  initialCategories: Category[];
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleStatusChange = (categoryId: string, newStatus: ApprovalStatus) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, status: newStatus } : c))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: newName.trim(),
      slug: slugify(newName.trim()),
      description: newDesc.trim() || null,
      status: "APPROVED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCategories([newCategory, ...categories]);
    setNewName("");
    setNewDesc("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#5d3805]">
            Categorías Globales y Solicitadas
          </h3>
          <p className="text-xs text-[#373737]/75">
            Aprueba solicitudes de vendedores o crea nuevas categorías globales para el marketplace.
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant="primary"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nueva Categoría
        </Button>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-[#dfd2be] bg-[#f1e7d5]/60 p-5 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#5d3805] font-bold text-sm">
            <Sparkles className="h-4 w-4 text-[#ca9029]" />
            <span>Crear Categoría Global</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#373737] block mb-1">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Calzado Deportivo"
                className="w-full rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#373737] block mb-1">
                Descripción corta (opcional)
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Ej: Zapatillas para running y entrenamiento"
                className="w-full rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Guardar Categoría
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#373737]">
            <thead className="bg-[#f1e7d5] text-xs font-bold uppercase tracking-wider text-[#5d3805]">
              <tr>
                <th className="px-6 py-4">Nombre / Slug</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Origen</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfd2be]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#f1e7d5]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#ca9029]" />
                      <div>
                        <span className="font-bold text-[#2e5e4e] block">
                          {cat.name}
                        </span>
                        <span className="text-xs text-[#373737]/60 font-mono">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#373737]/75 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {cat.requestedById ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[#5d3805] bg-[#ca9029]/20 border border-[#ca9029]/40 px-2.5 py-1 rounded-md font-bold">
                          Solicitada por Vendedor
                        </span>
                        {cat.requestedBy?.vendor?.storeName && (
                          <span className="text-[#373737]/75 text-xs">
                            Tienda: {cat.requestedBy.vendor.storeName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#2e5e4e] bg-[#a8bca8]/25 border border-[#a8bca8]/60 px-2.5 py-1 rounded-md font-bold">
                        Creada por Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {cat.status === "APPROVED" ? (
                      <Badge variant="success">Aprobada</Badge>
                    ) : cat.status === "PENDING" ? (
                      <Badge variant="warning">Pendiente</Badge>
                    ) : (
                      <Badge variant="danger">Rechazada</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {cat.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusChange(cat.id, "APPROVED")}
                          className="text-xs"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(cat.id, "REJECTED")}
                          className="text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#373737]/60 font-medium">Activa</span>
                    )}
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
