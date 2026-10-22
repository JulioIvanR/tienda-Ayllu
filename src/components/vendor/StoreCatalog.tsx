"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { Product, Category, Vendor } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface StoreCatalogProps {
  products: Product[];
  categories: Category[];
  vendor: Vendor;
}

export function StoreCatalog({ products, categories, vendor }: StoreCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            if (count === 0 && selectedCategory !== cat.id) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el catálogo..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              vendorSlug={vendor.slug}
              vendorName={vendor.storeName}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-16 px-4 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <PackageX className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No se encontraron productos
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Prueba ajustando los filtros de categoría o el término de búsqueda.
          </p>
          {(selectedCategory !== "all" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:bg-white dark:text-slate-900 cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
