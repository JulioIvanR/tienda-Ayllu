"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Tag, ShieldCheck, ArrowLeft, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  {
    name: "Resumen General",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Aprobación de Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    name: "Gestión de Categorías",
    href: "/admin/categorias",
    icon: Tag,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 min-h-[calc(100vh-4rem)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-3 py-2 text-violet-700 dark:text-violet-400 font-semibold text-sm">
        <ShieldCheck className="h-5 w-5" />
        <span>Panel Super Admin</span>
      </div>

      <nav className="mt-6 space-y-1">
        {ADMIN_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
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
