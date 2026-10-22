import prisma from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-data";
import { UsersTable } from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users = MOCK_USERS;

  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbUsers.length > 0) {
      users = dbUsers as any;
    }
  } catch (error) {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Aprobación de Vendedores y Usuarios
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona las solicitudes de alta de nuevos vendedores en la plataforma.
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
