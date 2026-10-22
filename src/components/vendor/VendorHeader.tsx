import { Vendor } from "@/types";
import { MessageCircle, MapPin, CheckCircle, Store } from "lucide-react";
import { buildWhatsAppStoreInquiryUrl } from "@/lib/whatsapp";

interface VendorHeaderProps {
  vendor: Vendor;
  productCount?: number;
}

export function VendorHeader({ vendor, productCount = 0 }: VendorHeaderProps) {
  const whatsappUrl = buildWhatsAppStoreInquiryUrl(vendor.whatsappNumber, vendor.storeName);

  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800">
        {vendor.bannerUrl && (
          <img
            src={vendor.bannerUrl}
            alt={vendor.storeName}
            className="h-full w-full object-cover opacity-85"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Profile Bar */}
      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-4 border-white bg-white shadow-md dark:border-slate-900 shrink-0">
              {vendor.logoUrl ? (
                <img
                  src={vendor.logoUrl}
                  alt={vendor.storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-800">
                  <Store className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Store Title Info */}
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {vendor.storeName}
                </h1>
                <span title="Vendedor Verificado">
                  <CheckCircle className="h-5 w-5 fill-emerald-500 text-white" />
                </span>
              </div>
              {vendor.city && (
                <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{vendor.city}</span>
                  {vendor.address && <span>• {vendor.address}</span>}
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Chat CTA */}
          <div className="flex items-center gap-3 self-start sm:self-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Description Bio */}
        {vendor.description && (
          <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {vendor.description}
          </p>
        )}

        {/* Stats counter */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <span>{productCount} productos publicados</span>
          <span>•</span>
          <span>Atención directa sin intermediarios</span>
        </div>
      </div>
    </div>
  );
}
