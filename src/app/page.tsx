import Link from "next/link";
import {
  MessageCircle,
  Store,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { MOCK_VENDORS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";

export default function HomePage() {
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
                href="/#productos"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-6 py-3.5 text-sm font-bold shadow-md shadow-[#ca9029]/25 transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Ingresar a mi tienda</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#ca9029]/20 text-[#ca9029] flex items-center justify-center mb-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#5d3805] text-lg">
              Venta Directa por WhatsApp
            </h3>
            <p className="mt-2 text-sm text-[#373737]/85 leading-relaxed">
              Sin pasarelas de pago engorrosas ni comisiones fijas. El cliente arma su pedido y abre una conversación pre-llenada con el vendedor.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#2e5e4e]/15 text-[#2e5e4e] flex items-center justify-center mb-4">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#5d3805] text-lg">
              Mini-tiendas con Slug Único
            </h3>
            <p className="mt-2 text-sm text-[#373737]/85 leading-relaxed">
              Cada vendedor cuenta con su propia URL personalizada (<code className="text-xs bg-[#f1e7d5] border border-[#dfd2be] text-[#5d3805] px-1.5 py-0.5 rounded font-mono">/vendedor/[slug]</code>), banner, datos de contacto y catálogo segmentado.
            </p>
          </div>

          <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#a8bca8]/35 text-[#2e5e4e] flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-[#5d3805] text-lg">
              Gobernanza Super Admin
            </h3>
            <p className="mt-2 text-sm text-[#373737]/85 leading-relaxed">
              Control de calidad con flujo de aprobación para vendedores y categorías globales antes de habilitar su publicación en la plataforma.
            </p>
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
          {MOCK_VENDORS.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendedor/${vendor.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#ca9029]/60"
            >
              <div className="h-32 w-full overflow-hidden bg-[#e8ded0]">
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
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                    {vendor.logoUrl ? (
                      <img
                        src={vendor.logoUrl}
                        alt={vendor.storeName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#a8bca8]/30 text-[#2e5e4e] font-bold">
                        {vendor.storeName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5d3805] text-base group-hover:text-[#ca9029] transition-colors">
                      {vendor.storeName}
                    </h3>
                    <p className="text-xs text-[#373737]/65">/{vendor.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-[#373737]/85 line-clamp-2">
                  {vendor.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#dfd2be] pt-3 text-xs text-[#ca9029] font-bold">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
              Productos Populares
            </h2>
            <p className="text-sm text-[#373737]/80">
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
