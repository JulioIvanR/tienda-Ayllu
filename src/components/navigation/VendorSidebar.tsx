"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  PlusCircle,
  Store,
  ArrowLeft,
  ExternalLink,
  SlidersHorizontal,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VENDOR_LINKS = [
  {
    name: "Resumen",
    href: "/vendedor-panel",
    icon: LayoutDashboard,
  },
  {
    name: "Mis Productos",
    href: "/vendedor-panel/productos",
    icon: Package,
  },
  {
    name: "Publicar Producto",
    href: "/vendedor-panel/productos/nuevo",
    icon: PlusCircle,
  },
  {
    name: "Perfil de Tienda & WhatsApp",
    href: "/vendedor-panel/perfil",
    icon: Store,
  },
];

interface VendorSidebarProps {
  storeName?: string | null;
  storeSlug?: string | null;
}

export function VendorSidebar({ storeName, storeSlug }: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[#dfd2be] bg-[#fcf8f0] p-4 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center gap-2 text-[#5d3805] font-bold text-sm">
          <SlidersHorizontal className="h-5 w-5 text-[#ca9029]" />
          <span>Panel de Vendedor</span>
        </div>
        {storeName && (
          <p className="text-xs font-semibold text-[#2e5e4e] truncate pl-7">
            {storeName}
          </p>
        )}
      </div>

      <nav className="mt-6 space-y-1">
        {VENDOR_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                isActive
                  ? "bg-[#ca9029]/20 text-[#5d3805]"
                  : "text-[#373737] hover:bg-[#a8bca8]/25 hover:text-[#2e5e4e]"
              )}
            >
              <Icon className="h-4 w-4 text-[#ca9029]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-[#dfd2be] space-y-2">
        {storeSlug && (
          <Link
            href={`/vendedor/${storeSlug}`}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-bold text-white bg-[#2e5e4e] rounded-xl hover:bg-[#244b3e] shadow-2xs transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              Ver mi tienda pública
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#373737]/75 hover:text-[#2e5e4e]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Marketplace</span>
        </Link>
      </div>
    </aside>
  );
}
