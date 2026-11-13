import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  vendorSlug?: string;
  vendorName?: string;
}

export function ProductCard({ product, vendorSlug, vendorName }: ProductCardProps) {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#b03917]/60">
      {/* Product Image */}
      <Link href={`/producto/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-[#e8ded0]">
        <img
          src={displayImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="warning">¡Últimas {product.stock} un!</Badge>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="danger">Agotado</Badge>
          </div>
        )}
      </Link>

      {/* Product Body */}
      <div className="flex flex-1 flex-col p-4">
        {vendorName && vendorSlug && (
          <Link
            href={`/vendedor/${vendorSlug}`}
            className="text-xs font-semibold text-[#b03917] hover:underline mb-1"
          >
            {vendorName}
          </Link>
        )}

        <Link href={`/producto/${product.slug}`}>
          <h4 className="font-bold text-[#5d3805] line-clamp-2 hover:text-[#2e5e4e] transition-colors text-sm sm:text-base">
            {product.title}
          </h4>
        </Link>

        <p className="mt-1 text-xs text-[#373737]/80 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-[#dfd2be]">
          <div>
            <span className="text-[11px] text-[#373737]/65 block font-medium">Precio</span>
            <span className="text-lg font-black text-[#5d3805]">
              {formatCurrency(Number(product.price))}
            </span>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="flex items-center gap-1.5 rounded-xl bg-[#b03917] hover:bg-[#8f2c0f] text-white px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Pedir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
