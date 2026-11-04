import Link from "next/link";
import { Store, ShieldCheck, ShoppingBag, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dfd2be] bg-[#fcf8f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2e5e4e] text-white shadow-md shadow-[#2e5e4e]/25 group-hover:scale-105 transition-transform">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[#2e5e4e]">
              Tienda AYLLU
            </span>
            <span className="ml-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#a8bca8]/30 text-[#2e5e4e] border border-[#a8bca8]/60">
              WhatsApp Direct
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/vendedor/cafe-origen"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#2e5e4e] hover:bg-[#a8bca8]/20 rounded-lg transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-[#2e5e4e]" />
            <span className="hidden sm:inline">Demo Tienda</span>
          </Link>

          <Link
            href="/vendedor-panel"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#ca9029] hover:bg-[#ca9029]/15 rounded-lg transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-[#ca9029]" />
            <span>Panel Vendedor</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#5d3805] hover:bg-[#5d3805]/10 rounded-lg transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-[#5d3805]" />
            <span className="hidden sm:inline">Super Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
