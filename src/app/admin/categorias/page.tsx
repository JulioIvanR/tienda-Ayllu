import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories = MOCK_CATEGORIES;

  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbCategories.length > 0) {
      categories = dbCategories as any;
    }
  } catch (error) {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión Global de Categorías
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Crea nuevas categorías oficiales o aprueba las categorías solicitadas por los vendedores.
        </p>
      </div>

      <CategoriesTable initialCategories={categories} />
    </div>
  );
}
