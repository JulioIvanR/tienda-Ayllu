"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, PlusCircle, Store, ArrowLeft, ExternalLink, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const VENDOR_LINKS = [
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

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 min-h-[calc(100vh-4rem)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-3 py-2 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
        <SlidersHorizontal className="h-5 w-5" />
        <span>Panel de Vendedor</span>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link
          href="/vendedor/cafe-origen"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
        >
          <span className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" />
            Ver mi tienda pública
          </span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Marketplace</span>
        </Link>
      </div>
    </aside>
  );
}
