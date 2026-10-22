import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Vendly</span>
            <span className="text-sm text-slate-500">
              — Plataforma multivendedor con checkout y contacto vía WhatsApp.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
              Inicio
            </Link>
            <Link href="/vendedor/cafe-origen" className="hover:text-slate-900 dark:hover:text-white">
              Mini-tienda demo
            </Link>
            <Link href="/vendedor-panel" className="hover:text-slate-900 dark:hover:text-white">
              Vendedores
            </Link>
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white">
              Super Admin
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800">
          <p className="flex items-center gap-1">
            Construido con Next.js (App Router), Tailwind CSS & Prisma ORM.
          </p>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 sm:mt-0 font-medium">
            <MessageCircle className="h-4 w-4" />
            <span>Redirección nativa a WhatsApp API (wa.me)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
