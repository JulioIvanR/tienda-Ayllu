import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import {
  MOCK_VENDORS,
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
} from "@/lib/mock-data";
import { VendorHeader } from "@/components/vendor/VendorHeader";
import { StoreCatalog } from "@/components/vendor/StoreCatalog";
import { Vendor, Product, Category } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getVendorData(slug: string) {
  try {
    // Attempt database lookup
    const dbVendor = await prisma.vendor.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: { category: true },
        },
      },
    });

    if (dbVendor) {
      const dbCategories = await prisma.category.findMany({
        where: { status: "APPROVED" },
      });

      return {
        vendor: {
          ...dbVendor,
          products: undefined,
        } as Vendor,
        products: dbVendor.products.map((p) => ({
          ...p,
          price: Number(p.price),
        })) as Product[],
        categories: dbCategories as Category[],
      };
    }
  } catch (error) {
    // Database connection not initialized or empty; proceed to mock fallback
  }

  // Fallback to rich mock data
  const mockVendor = MOCK_VENDORS.find((v) => v.slug === slug);
  if (!mockVendor) return null;

  const mockProducts = MOCK_PRODUCTS.filter(
    (p) => p.vendorId === mockVendor.id && p.isActive
  );
  const approvedCategories = MOCK_CATEGORIES.filter(
    (c) => c.status === "APPROVED"
  );

  return {
    vendor: mockVendor,
    products: mockProducts,
    categories: approvedCategories,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getVendorData(slug);

  if (!data) {
    return {
      title: "Tienda no encontrada | Vendly",
    };
  }

  return {
    title: `${data.vendor.storeName} | Tienda Oficial`,
    description: data.vendor.description || `Catálogo oficial de ${data.vendor.storeName} en Vendly.`,
  };
}

export default async function VendorStorePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getVendorData(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Vendor Profile Header */}
      <VendorHeader
        vendor={data.vendor}
        productCount={data.products.length}
      />

      {/* Catalog with Category Filters and Search */}
      <div className="mt-8">
        <StoreCatalog
          products={data.products}
          categories={data.categories}
          vendor={data.vendor}
        />
      </div>
    </div>
  );
}
