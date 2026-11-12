"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, PackageX } from "lucide-react";
import { Category, Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface HomeProductsSectionProps {
  initialProducts: Product[];
  initialHasMore: boolean;
  categories: Category[];
  pageSize?: number;
}

export function HomeProductsSection({
  initialProducts,
  initialHasMore,
  categories,
  pageSize = 8,
}: HomeProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSelectCategory = async (categoryId: string) => {
    if (categoryId === selectedCategory && !error) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSelectedCategory(categoryId);
    setError("");
    setIsFiltering(true);
    setIsLoadingMore(false);
    isFetchingRef.current = true;

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: String(pageSize),
      });
      if (categoryId !== "all") {
        params.set("categoryId", categoryId);
      }

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar los productos.");
      }

      const data = await res.json();
      setProducts(data.products || []);
      setPage(1);
      setHasMore(Boolean(data.hasMore));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Error al filtrar productos:", err);
      setError("Ocurrió un error al filtrar los productos.");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsFiltering(false);
        isFetchingRef.current = false;
      }
    }
  };

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    setError("");

    const nextPage = page + 1;

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(pageSize),
      });
      if (selectedCategory !== "all") {
        params.set("categoryId", selectedCategory);
      }

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar más productos.");
      }

      const data = await res.json();
      const incoming: Product[] = data.products || [];

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = incoming.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Error al cargar más productos:", err);
      setError("No se pudieron cargar más productos.");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    }
  }, [hasMore, page, pageSize, selectedCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isFetchingRef.current && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleSelectCategory("all")}
          className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#2e5e4e] text-white shadow-sm"
              : "bg-[#fdfbf6] text-[#373737] hover:bg-[#a8bca8]/25 border border-[#dfd2be]"
          }`}
        >
          Todas
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#ca9029] text-white shadow-sm"
                : "bg-[#fdfbf6] text-[#373737] hover:bg-[#a8bca8]/25 border border-[#dfd2be]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isFiltering && products.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#ca9029]" />
        </div>
      ) : products.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity ${
            isFiltering ? "opacity-60 pointer-events-none" : "opacity-100"
          }`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              vendorSlug={product.vendor?.slug}
              vendorName={product.vendor?.storeName}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#dfd2be] bg-[#fdfbf6] py-16 px-4 text-center">
          <PackageX className="h-12 w-12 text-[#5d3805]/40 mb-3" />
          <h3 className="text-lg font-bold text-[#5d3805]">
            No hay productos en esta categoría
          </h3>
          <p className="mt-1 text-sm text-[#373737]/80 max-w-sm">
            Aún no hay productos publicados para este filtro.
          </p>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className="mt-4 rounded-xl bg-[#ca9029] text-white px-4 py-2 text-xs font-bold hover:bg-[#b57f22] cursor-pointer transition-colors"
            >
              Ver todas las categorías
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() =>
              products.length === 0
                ? handleSelectCategory(selectedCategory)
                : loadMore()
            }
            className="rounded-xl bg-[#ca9029] px-4 py-2 text-xs font-bold text-white hover:bg-[#b57f22] cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Infinite Scroll Loading Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm font-medium text-[#5d3805]">
          <Loader2 className="h-5 w-5 animate-spin text-[#ca9029]" />
          <span>Cargando más productos...</span>
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && !isFiltering && (
        <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />
      )}
    </div>
  );
}
