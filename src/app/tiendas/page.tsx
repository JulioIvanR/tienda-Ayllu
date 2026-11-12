import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShoppingBag, Store } from "lucide-react";
import { getApprovedVendors } from "@/lib/catalog";
import { StoresDirectory } from "@/components/vendor/StoresDirectory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todas las Tiendas | Tienda AYLLU",
  description:
    "Explora todas las tiendas verificadas de Tienda AYLLU y compra directamente con cada vendedor vía WhatsApp.",
};

export default async function TiendasPage() {
  const { vendors, total } = await getApprovedVendors();

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#fbf7ee] border-b border-[#dfd2be] py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#a8bca8]/20 via-[#ca9029]/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ca9029] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#a8bca8] bg-[#a8bca8]/25 px-3.5 py-1 text-xs font-semibold text-[#2e5e4e]">
                <Store className="h-3.5 w-3.5 text-[#ca9029]" />
                <span>
                  {total} {total === 1 ? "tienda verificada" : "tiendas verificadas"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2e5e4e]">
                Todas las Tiendas
              </h1>

              <p className="text-base text-[#373737]/85 leading-relaxed">
                Descubre a todos los emprendedores y proyectos del Ayllu ILUMINA. Ingresa a cualquier mini-tienda para explorar su catálogo y coordinar tu pedido directo por WhatsApp.
              </p>
            </div>

            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-5 py-3 text-sm font-bold shadow-md shadow-[#ca9029]/25 transition-all hover:scale-[1.02] self-start md:self-auto shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Registra mi tienda</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StoresDirectory vendors={vendors} />
      </section>
    </div>
  );
}
