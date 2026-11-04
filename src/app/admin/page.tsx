import Link from "next/link";
import { Users, Tag, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { MOCK_USERS, MOCK_CATEGORIES } from "@/lib/mock-data";
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
          Panel de Control Super Admin
        </h1>
        <p className="mt-1 text-sm text-[#373737]/75">
          Supervisa y autoriza vendedores, tiendas y categorías globales en la plataforma.
        </p>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Total Usuarios</p>
              <p className="text-2xl font-black text-[#2e5e4e] mt-1">
                {data.stats.totalUsers}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#2e5e4e]/15 text-[#2e5e4e] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Vendedores Pendientes</p>
              <p className="text-2xl font-black text-[#ca9029] mt-1">
                {data.stats.pendingUsersCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Categorías Globales</p>
              <p className="text-2xl font-black text-[#5d3805] mt-1">
                {data.stats.totalCategories}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#a8bca8]/35 text-[#2e5e4e] flex items-center justify-center">
              <Tag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Categorías Solicitadas</p>
              <p className="text-2xl font-black text-[#ca9029] mt-1">
                {data.stats.pendingCategoriesCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Approval Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#5d3805]">
              Gestión de Aprobación de Usuarios
            </h2>
            <p className="text-xs text-[#373737]/75">
              Aprueba o suspende cuentas de vendedores para permitirles publicar productos.
            </p>
          </div>
          <Link
            href="/admin/usuarios"
            className="text-xs font-bold text-[#ca9029] hover:underline flex items-center gap-1"
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
            <h2 className="text-lg font-bold text-[#5d3805]">
              Categorías de Productos
            </h2>
            <p className="text-xs text-[#373737]/75">
              Revisa categorías solicitadas por vendedores o agrega nuevas categorías globales.
            </p>
          </div>
          <Link
            href="/admin/categorias"
            className="text-xs font-bold text-[#ca9029] hover:underline flex items-center gap-1"
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
