import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Store,
} from "lucide-react";
import {
  DEFAULT_PRODUCTS_PAGE_SIZE,
  getApprovedCategories,
  getApprovedVendors,
  getProductsPage,
} from "@/lib/catalog";
import { HomeProductsSection } from "@/components/product/HomeProductsSection";
import { VendorCard } from "@/components/vendor/VendorCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredVendors, initialCatalog] = await Promise.all([
    getApprovedVendors({ limit: 3 }),
    getProductsPage({
      page: 1,
      limit: DEFAULT_PRODUCTS_PAGE_SIZE,
    }),
  ]);
  const categories = await getApprovedCategories(
    initialCatalog.source === "database"
  );

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fbf7ee] border-b border-[#dfd2be] py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#a8bca8]/20 via-[#ca9029]/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a8bca8] bg-[#a8bca8]/25 px-3.5 py-1 text-xs font-semibold text-[#2e5e4e]">
              <Sparkles className="h-3.5 w-3.5 text-[#ca9029]" />
              <span>Next.js App Router + Prisma PostgreSQL + WhatsApp API</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2e5e4e] leading-[1.1]">
              Nadie llega a ser quien es por sí solo
            </h1>

            <p className="text-lg text-[#373737] leading-relaxed">
              En el Ayllu ILUMINA, quienes caminan el despertar comparten lo que su proceso ha hecho florecer; al elegir lo que otro creó, sostienes su camino, y él sostiene el tuyo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-6 py-3.5 text-sm font-bold shadow-md shadow-[#ca9029]/25 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Registra mi tienda</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
              Tiendas Destacadas
            </h2>
            <p className="text-sm text-[#373737]/80">
              Descubre vendedores verificados y sus productos exclusivos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVendors.vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/tiendas"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-6 py-3 text-sm font-bold shadow-md shadow-[#ca9029]/25 transition-all hover:scale-[1.02]"
          >
            <Store className="h-4 w-4" />
            <span>Ver todas las tiendas</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Products Catalog with Category Filter & Infinite Scroll */}
      <section id="productos" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
            Productos
          </h2>
        </div>

        <HomeProductsSection
          initialProducts={initialCatalog.products}
          initialHasMore={initialCatalog.hasMore}
          categories={categories}
          pageSize={DEFAULT_PRODUCTS_PAGE_SIZE}
        />
      </section>
    </div>
  );
}
