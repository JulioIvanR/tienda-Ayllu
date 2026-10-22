import Link from "next/link";
import { Users, Store, Tag, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { MOCK_USERS, MOCK_CATEGORIES, MOCK_VENDORS } from "@/lib/mock-data";
import { UsersTable } from "@/components/admin/UsersTable";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { Card, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

async function getAdminOverview() {
  try {
    const [userCount, pendingUsers, categoryCount, pendingCats] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({ where: { status: "PENDING" } }),
      prisma.category.count(),
      prisma.category.findMany({ where: { status: "PENDING" } }),
    ]);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      stats: {
        totalUsers: userCount,
        pendingUsersCount: pendingUsers.length,
        totalCategories: categoryCount,
        pendingCategoriesCount: pendingCats.length,
      },
      users,
      categories,
    };
  } catch (error) {
    // Return mock data fallback
    return {
      stats: {
        totalUsers: MOCK_USERS.length,
        pendingUsersCount: MOCK_USERS.filter((u) => u.status === "PENDING").length,
        totalCategories: MOCK_CATEGORIES.length,
        pendingCategoriesCount: MOCK_CATEGORIES.filter((c) => c.status === "PENDING").length,
      },
      users: MOCK_USERS,
      categories: MOCK_CATEGORIES,
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Panel de Control Super Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Supervisa y autoriza vendedores, tiendas y categorías globales en la plataforma.
        </p>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {data.stats.totalUsers}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center dark:bg-violet-950 dark:text-violet-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Vendedores Pendientes</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {data.stats.pendingUsersCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Categorías Globales</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {data.stats.totalCategories}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center dark:bg-indigo-950 dark:text-indigo-400">
              <Tag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Categorías Solicitadas</p>
              <p className="text-2xl font-bold text-violet-600 mt-1">
                {data.stats.pendingCategoriesCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center dark:bg-violet-950 dark:text-violet-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Approval Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Gestión de Aprobación de Usuarios
            </h2>
            <p className="text-xs text-slate-500">
              Aprueba o suspende cuentas de vendedores para permitirles publicar productos.
            </p>
          </div>
          <Link
            href="/admin/usuarios"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>Ver todo</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <UsersTable initialUsers={data.users as any} />
      </section>

      {/* Categories Approval Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Categorías de Productos
            </h2>
            <p className="text-xs text-slate-500">
              Revisa categorías solicitadas por vendedores o agrega nuevas categorías globales.
            </p>
          </div>
          <Link
            href="/admin/categorias"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>Gestionar categorías</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <CategoriesTable initialCategories={data.categories as any} />
      </section>
    </div>
  );
}
