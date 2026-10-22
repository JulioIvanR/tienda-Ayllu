import Link from "next/link";
import {
  MessageCircle,
  Store,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";
import { MOCK_VENDORS, MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 py-16 sm:py-24 dark:bg-slate-900 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 via-indigo-50/20 to-transparent dark:from-emerald-950/20 dark:via-indigo-950/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next.js App Router + Prisma PostgreSQL + WhatsApp API</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              Tu tienda multivendedor con{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                checkout directo a WhatsApp
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Permite que múltiples vendedores creen su propio catálogo personalizado y
              reciban órdenes de compra directamente en su WhatsApp (wa.me) con el detalle del producto,
              cantidad y precio calculado al instante.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/vendedor/cafe-origen"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explorar Mini-Tienda Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/vendedor-panel"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-6 py-3.5 text-sm font-bold shadow-xs transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <Store className="h-4 w-4 text-indigo-600" />
                <span>Acceder a Panel Vendedor</span>
              </Link>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50/70 hover:bg-violet-100 text-violet-800 px-5 py-3.5 text-sm font-bold transition-all dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
              >
                <ShieldCheck className="h-4 w-4 text-violet-600" />
                <span>Super Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mb-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Venta Directa por WhatsApp
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Sin pasarelas de pago engorrosas ni comisiones fijas. El cliente arma su pedido y abre una conversación pre-llenada con el vendedor.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Mini-tiendas con Slug Único
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Cada vendedor cuenta con su propia URL personalizada (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">/vendedor/[slug]</code>), banner, datos de contacto y catálogo segmentado.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Gobernanza Super Admin
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Control de calidad con flujo de aprobación para vendedores y categorías globales antes de habilitar su publicación en la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Tiendas Destacadas
            </h2>
            <p className="text-sm text-slate-500">
              Descubre vendedores verificados y sus productos exclusivos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VENDORS.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendedor/${vendor.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-32 w-full overflow-hidden bg-slate-100">
                {vendor.bannerUrl && (
                  <img
                    src={vendor.bannerUrl}
                    alt={vendor.storeName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 -mt-10 mb-3">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white dark:border-slate-900 shrink-0">
                    {vendor.logoUrl ? (
                      <img
                        src={vendor.logoUrl}
                        alt={vendor.storeName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-800 font-bold">
                        {vendor.storeName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {vendor.storeName}
                    </h3>
                    <p className="text-xs text-slate-400">/{vendor.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                  {vendor.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-emerald-600 font-semibold dark:border-slate-800">
                  <span>Ver catálogo</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Productos Populares
            </h2>
            <p className="text-sm text-slate-500">
              Haz clic en cualquier producto para probar el botón dinámico de compra por WhatsApp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.slice(0, 4).map((product) => {
            const vendor = MOCK_VENDORS.find((v) => v.id === product.vendorId);
            return (
              <ProductCard
                key={product.id}
                product={product}
                vendorSlug={vendor?.slug}
                vendorName={vendor?.storeName}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
