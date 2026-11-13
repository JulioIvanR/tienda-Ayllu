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
    <aside className="w-64 shrink-0 border-r border-[#dfd2be] bg-[#fcf8f0] p-4 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2 px-3 py-2 text-[#2e5e4e] font-bold text-sm">
        <ShieldCheck className="h-5 w-5 text-[#b03917]" />
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                isActive
                  ? "bg-[#2e5e4e]/15 text-[#2e5e4e]"
                  : "text-[#373737] hover:bg-[#a8bca8]/25 hover:text-[#5d3805]"
              )}
            >
              <Icon className="h-4 w-4 text-[#2e5e4e]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#dfd2be]">
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
