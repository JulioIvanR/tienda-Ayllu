import { AdminSidebar } from "@/components/navigation/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
