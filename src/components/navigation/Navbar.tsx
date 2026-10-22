import Link from "next/link";
import { Store, ShieldCheck, ShoppingBag, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Vendly
            </span>
            <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              WhatsApp Direct
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/vendedor/cafe-origen"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Demo Tienda</span>
          </Link>

          <Link
            href="/vendedor-panel"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-600" />
            <span>Panel Vendedor</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ShieldCheck className="h-4 w-4 text-violet-600" />
            <span className="hidden sm:inline">Super Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
