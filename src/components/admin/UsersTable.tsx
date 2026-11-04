"use client";

import { useState } from "react";
import { User, ApprovalStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, Shield, Store } from "lucide-react";

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
            {users.map((user) => (
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
                <td className="px-6 py-4 text-xs text-[#373737]/65 font-medium">
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
                        variant={user.status === "APPROVED" ? "outline" : "primary"}
                        disabled={user.status === "APPROVED"}
                        onClick={() => handleStatusChange(user.id, "APPROVED")}
                        className="text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant={user.status === "REJECTED" ? "outline" : "danger"}
                        disabled={user.status === "REJECTED"}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
