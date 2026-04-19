"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type ProductThumbnailProps = {
  src: string | null;
  alt: string;
};

function buildProxyImageUrl(image: string): string {
  return `/api/image?src=${encodeURIComponent(image)}`;
}

export default function ProductThumbnail({
  src,
  alt,
}: ProductThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f9efe0] via-[#fffaf1] to-[#ead9c2] text-brand-muted dark:from-[#182025] dark:via-[#202b31] dark:to-[#152026]">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <ImageOff size={18} className="opacity-75" />
          <span className="text-[10px] font-mono uppercase tracking-[0.18em]">
            Image unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={buildProxyImageUrl(src)}
      alt={alt}
      width={144}
      height={144}
      className="h-full w-full object-contain p-4"
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}
