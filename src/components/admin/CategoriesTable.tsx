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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Categorías Globales y Solicitadas
          </h3>
          <p className="text-xs text-slate-500">
            Aprueba solicitudes de vendedores o crea nuevas categorías globales para el marketplace.
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant="primary"
          size="sm"
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nueva Categoría
        </Button>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5 space-y-4 dark:border-violet-900/60 dark:bg-violet-950/20"
        >
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Crear Categoría Global</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Calzado Deportivo"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Descripción corta (opcional)
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Ej: Zapatillas para running y entrenamiento"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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
              className="bg-violet-600 hover:bg-violet-700"
            >
              Guardar Categoría
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Nombre / Slug</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Origen</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-violet-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {cat.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {cat.requestedById ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium dark:bg-amber-950/40 dark:text-amber-300">
                        Solicitada por Vendedor
                      </span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium dark:bg-slate-800 dark:text-slate-300">
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
                          variant="whatsapp"
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
                      <span className="text-xs text-slate-400">Activa</span>
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
