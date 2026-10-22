"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const validImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&h=800&fit=crop"];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <img
          src={validImages[selectedIndex]}
          alt={title}
          className="h-full w-full object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                selectedIndex === idx
                  ? "border-emerald-500 ring-2 ring-emerald-500/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${title} - miniatura ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
