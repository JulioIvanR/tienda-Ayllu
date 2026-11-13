import Link from "next/link";
import {
  ArrowRight,
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
      <section className="relative overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center bg-[#1a231f] border-b border-[#dfd2be]">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-right"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/jwoctsqu/image/upload/v1794590379/hero_ayllu.webp')`,
          }}
        />

        {/* Degradado oscuro para asegurar contraste y legibilidad óptima */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 sm:to-transparent" />

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl sm:max-w-3xl space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#b8ceb8] leading-[1.15]">
              E-commerce de la<br />
              Comunidad ILUMINA
            </h1>

            <p className="text-base sm:text-lg text-white/90 max-w-xl leading-relaxed">
              En Casa Ayllu encuentras productos y servicios de los estudiantes de ILUMINA. Un espacio hecho para apoyarnos en comunidad
            </p>

            <div className="pt-2">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#b03917] hover:bg-[#8f2c0f] text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-black/30 transition-all hover:scale-[1.02]"
              >
                <Store className="h-4 w-4" />
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
            className="inline-flex items-center gap-2 rounded-2xl bg-[#b03917] hover:bg-[#8f2c0f] text-white px-6 py-3 text-sm font-bold shadow-md shadow-[#b03917]/25 transition-all hover:scale-[1.02]"
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
