"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Store, X } from "lucide-react";
import type { VendorWithStats } from "@/lib/catalog";
import { VendorCard } from "@/components/vendor/VendorCard";

interface StoresDirectoryProps {
  vendors: VendorWithStats[];
}

export function StoresDirectory({ vendors }: StoresDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const cities = useMemo(() => {
    const unique = new Set<string>();
    for (const v of vendors) {
      const city = v.city?.trim();
      if (city) unique.add(city);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "es"));
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return vendors.filter((vendor) => {
      if (selectedCity !== "all") {
        if ((vendor.city?.trim() || "").toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      if (!query) return true;

      return (
        vendor.storeName.toLowerCase().includes(query) ||
        vendor.slug.toLowerCase().includes(query) ||
        (vendor.description || "").toLowerCase().includes(query) ||
        (vendor.city || "").toLowerCase().includes(query)
      );
    });
  }, [vendors, searchTerm, selectedCity]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
  };

  return (
    <div className="space-y-6">
      {/* Search & City Filters */}
      <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5d3805]/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tienda por nombre, ciudad o descripción..."
              className="w-full rounded-xl border border-[#dfd2be] bg-white pl-10 pr-9 py-2.5 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#b03917]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#373737]/50 hover:text-[#5d3805] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-[#5d3805] bg-[#f1e7d5] px-3 py-2 rounded-xl border border-[#dfd2be] shrink-0 self-start sm:self-auto">
            Mostrando {filteredVendors.length} de {vendors.length}{" "}
            {vendors.length === 1 ? "tienda" : "tiendas"}
          </span>
        </div>

        {cities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCity("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                selectedCity === "all"
                  ? "bg-[#2e5e4e] text-white shadow-xs"
                  : "border border-[#dfd2be] bg-white text-[#5d3805] hover:border-[#b03917] hover:text-[#b03917]"
              }`}
            >
              Todas las ciudades
            </button>
            {cities.map((city) => {
              const isActive = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2e5e4e] text-white shadow-xs"
                      : "border border-[#dfd2be] bg-white text-[#5d3805] hover:border-[#b03917] hover:text-[#b03917]"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Stores Grid */}
      {filteredVendors.length === 0 ? (
        <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-12 text-center space-y-3">
          <Store className="h-10 w-10 text-[#b03917] mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-[#2e5e4e]">
            No encontramos tiendas que coincidan
          </h3>
          <p className="text-sm text-[#373737]/75 max-w-md mx-auto">
            {vendors.length === 0
              ? "Todavía no hay tiendas aprobadas disponibles."
              : "Prueba con otro nombre o limpia los filtros para ver todas las tiendas disponibles."}
          </p>
          {(searchTerm || selectedCity !== "all") ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center rounded-xl bg-[#b03917] hover:bg-[#8f2c0f] px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              Mostrar todas las tiendas
            </button>
          ) : (
            <Link
              href="/registro"
              className="inline-flex items-center rounded-xl bg-[#b03917] hover:bg-[#8f2c0f] px-4 py-2 text-xs font-bold text-white"
            >
              Registrar una tienda
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
