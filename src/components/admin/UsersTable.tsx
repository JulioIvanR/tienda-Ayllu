"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ApprovalStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, Store } from "lucide-react";

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const router = useRouter();
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, ApprovalStatus>
  >({});
  const [updatingAction, setUpdatingAction] = useState<{
    userId: string;
    status: ApprovalStatus;
  } | null>(null);

  const users = initialUsers.map((user) =>
    statusOverrides[user.id]
      ? { ...user, status: statusOverrides[user.id] }
      : user
  );

  const handleStatusChange = async (
    userId: string,
    newStatus: ApprovalStatus
  ) => {
    setUpdatingAction({ userId, status: newStatus });

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "No se pudo actualizar el estado del usuario."
        );
      }

      const confirmedStatus: ApprovalStatus = data.user?.status ?? newStatus;
      setStatusOverrides((prev) => ({
        ...prev,
        [userId]: confirmedStatus,
      }));
      router.refresh();
    } catch (error: unknown) {
      console.error("Error al actualizar estado de usuario:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado del usuario."
      );
    } finally {
      setUpdatingAction(null);
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Aprobado</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pendiente</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rechazado</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#373737]">
          <thead className="bg-[#f1e7d5] text-xs font-bold uppercase tracking-wider text-[#5d3805]">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha de Registro</th>
              <th className="px-6 py-4 text-right">Acciones de Aprobación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfd2be]">
            {users.map((user) => {
              const isRowUpdating = updatingAction?.userId === user.id;

              return (
                <tr key={user.id} className="hover:bg-[#f1e7d5]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-[#2e5e4e] block">
                        {user.name || "Sin nombre"}
                      </span>
                      <span className="text-xs text-[#373737]/65">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === "SUPER_ADMIN" ? (
                        <>
                          <Shield className="h-4 w-4 text-[#2e5e4e]" />
                          <span className="font-bold text-[#2e5e4e] text-xs">Super Admin</span>
                        </>
                      ) : (
                        <>
                          <Store className="h-4 w-4 text-[#ca9029]" />
                          <span className="font-bold text-[#ca9029] text-xs">Vendedor</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td
                    suppressHydrationWarning
                    className="px-6 py-4 text-xs text-[#373737]/65 font-medium"
                  >
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === "VENDOR" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={user.status === "APPROVED" ? "outline" : "primary"}
                          disabled={user.status === "APPROVED" || isRowUpdating}
                          isLoading={
                            isRowUpdating && updatingAction?.status === "APPROVED"
                          }
                          onClick={() => handleStatusChange(user.id, "APPROVED")}
                          className="text-xs"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={user.status === "REJECTED" ? "outline" : "danger"}
                          disabled={user.status === "REJECTED" || isRowUpdating}
                          isLoading={
                            isRowUpdating && updatingAction?.status === "REJECTED"
                          }
                          onClick={() => handleStatusChange(user.id, "REJECTED")}
                          className="text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#373737]/50 italic">Acción bloqueada</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
