import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  LayoutDashboard,
  LogIn,
  ShoppingBag,
  Store,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portal de Tiendas y Vendedores | Tienda AYLLU",
  description:
    "Explora las tiendas verificadas de Tienda AYLLU o accede al panel de gestión para vendedores.",
};

export default function VendedorIndex() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f1e7d5] py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-[#dfd2be] bg-[#fdfbf6] p-8 sm:p-10 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#a8bca8] bg-[#a8bca8]/25 px-3.5 py-1 text-xs font-semibold text-[#2e5e4e]">
            <Store className="h-3.5 w-3.5 text-[#ca9029]" />
            <span>Espacio de Tiendas y Vendedores</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2e5e4e]">
              Tiendas y Panel de Vendedor
            </h1>
            <p className="text-base text-[#373737]/85 leading-relaxed max-w-2xl">
              Elige si deseas explorar el directorio completo de tiendas del Ayllu ILUMINA o ingresar a tu panel para gestionar productos y pedidos por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              href="/tiendas"
              className="group flex flex-col justify-between rounded-2xl border border-[#dfd2be] bg-white p-6 hover:border-[#ca9029] hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-[#a8bca8]/30 text-[#2e5e4e] flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-[#5d3805] group-hover:text-[#ca9029]">
                  Ver Todas las Tiendas
                </h2>
                <p className="text-sm text-[#373737]/75">
                  Explora todas las mini-tiendas verificadas y compra directo con cada vendedor.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ca9029]">
                Ir al directorio <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/vendedor-panel"
              className="group flex flex-col justify-between rounded-2xl border border-[#dfd2be] bg-white p-6 hover:border-[#ca9029] hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-[#5d3805] group-hover:text-[#ca9029]">
                  Panel de Vendedor
                </h2>
                <p className="text-sm text-[#373737]/75">
                  Administra tu perfil, sube logotipo/banner y publica productos en tu tienda.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ca9029]">
                Ingresar al panel <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[#dfd2be] pt-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2e5e4e] hover:bg-[#244b3e] text-white px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Iniciar sesión</span>
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Registrar nueva tienda</span>
            </Link>
            <Link
              href="/vendedor/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfd2be] bg-white px-4 py-2.5 text-xs font-bold text-[#5d3805] hover:border-[#ca9029]"
            >
              <span>Dashboard provisional</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
