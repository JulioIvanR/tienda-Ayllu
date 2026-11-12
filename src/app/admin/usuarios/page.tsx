import prisma from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-data";
import { UsersTable } from "@/components/admin/UsersTable";
import type { User } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: User[] = MOCK_USERS;

  try {
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbUsers.length > 0) {
      users = dbUsers.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));
    }
  } catch (error) {
    console.warn("Error al cargar usuarios desde la base de datos:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2e5e4e]">
          Aprobación de Vendedores y Usuarios
        </h1>
        <p className="mt-1 text-sm text-[#373737]/75">
          Gestiona las solicitudes de alta de nuevos vendedores en la plataforma.
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
