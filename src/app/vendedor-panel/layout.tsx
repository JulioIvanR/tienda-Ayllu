import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/lib/auth";
import { VendorSidebar } from "@/components/navigation/VendorSidebar";

export const dynamic = "force-dynamic";

export default async function VendorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSessionUser();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#f1e7d5]">
      <VendorSidebar
        storeName={session.vendor?.storeName}
        storeSlug={session.vendor?.slug}
      />
      <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
