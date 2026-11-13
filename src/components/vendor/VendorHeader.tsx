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
    <div className="relative mb-8 rounded-3xl overflow-hidden border border-[#dfd2be] bg-[#fdfbf6] shadow-xs">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-[#2e5e4e] via-[#5d3805] to-[#b03917]">
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
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-4 border-[#fdfbf6] bg-white shadow-md shrink-0">
              {vendor.logoUrl ? (
                <img
                  src={vendor.logoUrl}
                  alt={vendor.storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#a8bca8]/30 text-[#2e5e4e]">
                  <Store className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Store Title Info */}
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
                  {vendor.storeName}
                </h1>
                <span title="Vendedor Verificado">
                  <CheckCircle className="h-5 w-5 fill-[#2e5e4e] text-white" />
                </span>
              </div>
              {vendor.city && (
                <p className="flex items-center gap-1 text-sm text-[#373737]/75 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#b03917]" />
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
              <MessageCircle className="h-4 w-4 fill-white text-white" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Description Bio */}
        {vendor.description && (
          <p className="mt-5 text-sm sm:text-base text-[#373737] max-w-3xl leading-relaxed">
            {vendor.description}
          </p>
        )}

        {/* Stats counter */}
        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#373737]/70 border-t border-[#dfd2be] pt-3">
          <span>{productCount} productos publicados</span>
          <span>•</span>
          <span className="text-[#2e5e4e]">Atención directa sin intermediarios</span>
        </div>
      </div>
    </div>
  );
}
