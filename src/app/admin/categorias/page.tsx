"use client";

import { useState, useEffect } from "react";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<typeof MOCK_CATEGORIES>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok && data.categories) {
          setCategories(data.categories);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2e5e4e]">
          Gestión Global de Categorías
        </h1>
        <p className="mt-1 text-sm text-[#373737]/75">
          Crea nuevas categorías oficiales o aprueba las categorías solicitadas por los vendedores.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Cargando categorías...</p>
        </div>
      ) : (
        <CategoriesTable initialCategories={categories} />
      )}
    </div>
  );
}
