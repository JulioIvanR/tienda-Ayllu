import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Store, Tag, Check, PackageCheck, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { MOCK_PRODUCTS, MOCK_VENDORS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { WhatsAppBuyButton } from "@/components/product/WhatsAppBuyButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { Product, Vendor, Category } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        vendor: true,
        category: true,
      },
    });

    if (dbProduct) {
      const related = await prisma.product.findMany({
        where: {
          vendorId: dbProduct.vendorId,
          id: { not: dbProduct.id },
          isActive: true,
        },
        take: 3,
      });

      return {
        product: {
          ...dbProduct,
          price: Number(dbProduct.price),
        } as Product,
        vendor: dbProduct.vendor as Vendor,
        category: dbProduct.category as Category,
        relatedProducts: related.map((p) => ({
          ...p,
          price: Number(p.price),
        })) as Product[],
      };
    }
  } catch (error) {
    // Database connection or table not found; proceed to mock
  }

  const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!mockProduct) return null;

  const mockVendor = MOCK_VENDORS.find((v) => v.id === mockProduct.vendorId);
  const mockCategory = MOCK_CATEGORIES.find((c) => c.id === mockProduct.categoryId);
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.vendorId === mockProduct.vendorId && p.id !== mockProduct.id
  ).slice(0, 3);

  if (!mockVendor) return null;

  return {
    product: mockProduct,
    vendor: mockVendor,
    category: mockCategory || {
      id: "cat_general",
      name: "General",
      slug: "general",
      description: null,
      status: "APPROVED" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    relatedProducts,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return {
      title: "Producto no encontrado | Vendly",
    };
  }

  return {
    title: `${data.product.title} - ${data.vendor.storeName} | Vendly`,
    description: data.product.description.slice(0, 160),
    openGraph: {
      title: data.product.title,
      description: data.product.description.slice(0, 160),
      images: data.product.images.length > 0 ? [data.product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    notFound();
  }

  const { product, vendor, category, relatedProducts } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
          Inicio
        </Link>
        <span>/</span>
        <Link
          href={`/vendedor/${vendor.slug}`}
          className="hover:text-slate-900 dark:hover:text-white font-medium text-emerald-600 dark:text-emerald-400"
        >
          {vendor.storeName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Product Info & Dynamic WhatsApp Checkout */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vendor Pill */}
          <Link
            href={`/vendedor/${vendor.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:text-emerald-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span>Vendido por: <strong>{vendor.storeName}</strong></span>
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1 text-slate-500" />
                {category.name}
              </Badge>
              {product.stock > 0 ? (
                <Badge variant="success">
                  <PackageCheck className="h-3 w-3 mr-1" />
                  En stock ({product.stock} un)
                </Badge>
              ) : (
                <Badge variant="danger">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Agotado
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(Number(product.price))}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Precio unitario sugerido
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-200/80 pt-4 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Descripción del producto
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Dynamic WhatsApp Redirection Widget */}
          <div className="pt-2">
            <WhatsAppBuyButton product={product} vendor={vendor} />
          </div>
        </div>
      </div>

      {/* Related Products from the same Vendor */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 pt-12 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Más de {vendor.storeName}
            </h2>
            <Link
              href={`/vendedor/${vendor.slug}`}
              className="text-xs sm:text-sm font-semibold text-emerald-600 hover:underline"
            >
              Ver toda la tienda &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                vendorSlug={vendor.slug}
                vendorName={vendor.storeName}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
