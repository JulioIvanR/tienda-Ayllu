import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShoppingBag } from "lucide-react";
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Product Image */}
      <Link href={`/producto/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
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
            className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 mb-1"
          >
            {vendorName}
          </Link>
        )}

        <Link href={`/producto/${product.slug}`}>
          <h4 className="font-semibold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors dark:text-white text-sm sm:text-base">
            {product.title}
          </h4>
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Precio</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(Number(product.price))}
            </span>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Pedir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
