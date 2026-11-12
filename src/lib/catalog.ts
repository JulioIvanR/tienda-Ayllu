import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_VENDORS } from "@/lib/mock-data";
import { Category, Product, Vendor } from "@/types";

export interface VendorWithStats extends Vendor {
  productCount: number;
}

export const DEFAULT_PRODUCTS_PAGE_SIZE = 8;

export interface CatalogPageResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  source: "database" | "mock";
}

export async function getApprovedCategories(
  preferDatabase: boolean = true
): Promise<Category[]> {
  if (preferDatabase) {
    try {
      const dbCategories = await prisma.category.findMany({
        where: { status: "APPROVED" },
        orderBy: { name: "asc" },
      });

      if (dbCategories.length > 0) {
        return dbCategories.map((cat) => ({
          ...cat,
          createdAt: cat.createdAt.toISOString(),
          updatedAt: cat.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn(
        "No se pudieron cargar categorías desde BD; usando respaldo:",
        error
      );
    }
  }

  return MOCK_CATEGORIES.filter((c) => c.status === "APPROVED").map((cat) => ({
    ...cat,
    createdAt: new Date(cat.createdAt).toISOString(),
    updatedAt: new Date(cat.updatedAt).toISOString(),
  }));
}

export async function getProductsPage({
  page = 1,
  limit = DEFAULT_PRODUCTS_PAGE_SIZE,
  categoryId,
}: {
  page?: number;
  limit?: number;
  categoryId?: string;
}): Promise<CatalogPageResult> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));
  const cleanCategoryId =
    categoryId && categoryId !== "all" ? categoryId.trim() : undefined;

  try {
    const totalActiveInDb = await prisma.product.count({
      where: { isActive: true },
    });

    if (totalActiveInDb > 0) {
      const whereClause = {
        isActive: true,
        ...(cleanCategoryId ? { categoryId: cleanCategoryId } : {}),
      };

      const skip = (safePage - 1) * safeLimit;

      const [dbProducts, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: {
            vendor: true,
            category: true,
          },
          orderBy: [{ createdAt: "desc" }, { id: "asc" }],
          skip,
          take: safeLimit,
        }),
        prisma.product.count({ where: whereClause }),
      ]);

      const serialized: Product[] = dbProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        vendor: p.vendor
          ? {
              ...p.vendor,
              createdAt: p.vendor.createdAt.toISOString(),
              updatedAt: p.vendor.updatedAt.toISOString(),
            }
          : undefined,
        category: p.category
          ? {
              ...p.category,
              createdAt: p.category.createdAt.toISOString(),
              updatedAt: p.category.updatedAt.toISOString(),
            }
          : undefined,
      }));

      return {
        products: serialized,
        total,
        page: safePage,
        limit: safeLimit,
        hasMore: skip + serialized.length < total,
        source: "database",
      };
    }
  } catch (error) {
    console.warn(
      "No se pudieron cargar productos desde BD; usando respaldo:",
      error
    );
  }

  // Fallback a MOCK_PRODUCTS
  const filteredMock = MOCK_PRODUCTS.filter((p) => {
    if (!p.isActive) return false;
    if (cleanCategoryId && p.categoryId !== cleanCategoryId) return false;
    return true;
  });

  const skip = (safePage - 1) * safeLimit;
  const sliced = filteredMock.slice(skip, skip + safeLimit).map((p) => {
    const vendor = MOCK_VENDORS.find((v) => v.id === p.vendorId);
    const category = MOCK_CATEGORIES.find((c) => c.id === p.categoryId);

    return {
      ...p,
      price: Number(p.price),
      createdAt: new Date(p.createdAt).toISOString(),
      updatedAt: new Date(p.updatedAt).toISOString(),
      vendor: vendor
        ? {
            ...vendor,
            createdAt: new Date(vendor.createdAt).toISOString(),
            updatedAt: new Date(vendor.updatedAt).toISOString(),
          }
        : undefined,
      category: category
        ? {
            ...category,
            createdAt: new Date(category.createdAt).toISOString(),
            updatedAt: new Date(category.updatedAt).toISOString(),
          }
        : undefined,
    };
  });

  return {
    products: sliced,
    total: filteredMock.length,
    page: safePage,
    limit: safeLimit,
    hasMore: skip + sliced.length < filteredMock.length,
    source: "mock",
  };
}

export async function getApprovedVendors({
  limit,
}: {
  limit?: number;
} = {}): Promise<{
  vendors: VendorWithStats[];
  total: number;
  source: "database" | "mock";
}> {
  try {
    const whereClause = {
      user: {
        status: "APPROVED" as const,
      },
    };

    const [total, dbVendors] = await Promise.all([
      prisma.vendor.count({ where: whereClause }),
      prisma.vendor.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              products: {
                where: { isActive: true },
              },
            },
          },
        },
        orderBy: [
          { products: { _count: "desc" } },
          { createdAt: "desc" },
        ],
        ...(limit ? { take: limit } : {}),
      }),
    ]);

    if (dbVendors.length > 0) {
      return {
        vendors: dbVendors.map((v) => ({
          id: v.id,
          userId: v.userId,
          storeName: v.storeName,
          slug: v.slug,
          description: v.description,
          logoUrl: v.logoUrl,
          bannerUrl: v.bannerUrl,
          whatsappNumber: v.whatsappNumber,
          email: v.email,
          phone: v.phone,
          address: v.address,
          city: v.city,
          createdAt: v.createdAt.toISOString(),
          updatedAt: v.updatedAt.toISOString(),
          productCount: v._count.products,
        })),
        total,
        source: "database",
      };
    }
  } catch (error) {
    console.warn(
      "No se pudieron cargar tiendas desde BD; usando respaldo:",
      error
    );
  }

  const mappedMock: VendorWithStats[] = MOCK_VENDORS.map((v) => ({
    ...v,
    createdAt: new Date(v.createdAt).toISOString(),
    updatedAt: new Date(v.updatedAt).toISOString(),
    productCount: MOCK_PRODUCTS.filter(
      (p) => p.vendorId === v.id && p.isActive
    ).length,
  }));

  return {
    vendors: limit ? mappedMock.slice(0, limit) : mappedMock,
    total: mappedMock.length,
    source: "mock",
  };
}
