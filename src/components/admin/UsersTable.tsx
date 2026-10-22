"use client";

import { useState } from "react";
import { User, ApprovalStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, Store, Clock } from "lucide-react";

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleStatusChange = (userId: string, newStatus: ApprovalStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha de Registro</th>
              <th className="px-6 py-4 text-right">Acciones de Aprobación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="px-6 py-4">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {user.name || "Sin nombre"}
                    </span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === "SUPER_ADMIN" ? (
                      <>
                        <Shield className="h-4 w-4 text-violet-600" />
                        <span className="font-medium text-violet-600 text-xs">Super Admin</span>
                      </>
                    ) : (
                      <>
                        <Store className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-indigo-600 text-xs">Vendedor</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 text-xs text-slate-400">
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
                        size="sm"
                        variant={user.status === "APPROVED" ? "secondary" : "whatsapp"}
                        disabled={user.status === "APPROVED"}
                        onClick={() => handleStatusChange(user.id, "APPROVED")}
                        className="text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant={user.status === "REJECTED" ? "secondary" : "danger"}
                        disabled={user.status === "REJECTED"}
                        onClick={() => handleStatusChange(user.id, "REJECTED")}
                        className="text-xs"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Acción bloqueada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
