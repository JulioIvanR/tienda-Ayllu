import Link from "next/link";
import { ArrowRight, MapPin, Package } from "lucide-react";
import type { VendorWithStats } from "@/lib/catalog";

interface VendorCardProps {
  vendor: VendorWithStats;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link
      href={`/vendedor/${vendor.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#b03917]/60"
    >
      <div className="h-32 w-full overflow-hidden bg-gradient-to-r from-[#2e5e4e] via-[#5d3805] to-[#b03917]">
        {vendor.bannerUrl && (
          <img
            src={vendor.bannerUrl}
            alt={vendor.storeName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="-mt-11 h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
            {vendor.logoUrl ? (
              <img
                src={vendor.logoUrl}
                alt={vendor.storeName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#a8bca8]/30 text-[#2e5e4e] font-bold text-lg">
                {vendor.storeName[0]?.toUpperCase() || "T"}
              </div>
            )}
          </div>

          <div className="pt-2 min-w-0 flex-1">
            <h3 className="font-bold text-[#5d3805] text-base group-hover:text-[#b03917] transition-colors leading-snug truncate">
              {vendor.storeName}
            </h3>
            <p className="text-xs text-[#373737]/65 mt-0.5 truncate">
              /{vendor.slug}
            </p>
          </div>
        </div>

        <p className="text-xs text-[#373737]/85 line-clamp-2 flex-1">
          {vendor.description?.trim() ||
            "Explora el catálogo completo de esta tienda y realiza tu pedido directo por WhatsApp."}
        </p>

        {(vendor.city || typeof vendor.productCount === "number") && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#2e5e4e]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#a8bca8]/25 px-2.5 py-0.5 border border-[#a8bca8]/50">
              <Package className="h-3 w-3 text-[#b03917]" />
              {vendor.productCount}{" "}
              {vendor.productCount === 1 ? "producto" : "productos"}
            </span>
            {vendor.city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f1e7d5] px-2.5 py-0.5 border border-[#dfd2be] text-[#5d3805]">
                <MapPin className="h-3 w-3 text-[#b03917]" />
                {vendor.city}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#dfd2be] pt-3 text-xs text-[#b03917] font-bold">
          <span>Ver catálogo</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
