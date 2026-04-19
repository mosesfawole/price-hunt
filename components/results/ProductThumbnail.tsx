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
      <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#f7efe1] via-[#fff8ef] to-[#eadfcd] text-brand-muted dark:from-[#172127] dark:via-[#1d2a32] dark:to-[#122027]">
        <div className="flex flex-col items-center gap-1 text-center">
          <ImageOff size={18} className="opacity-70" />
          <span className="text-[10px] font-mono uppercase tracking-[0.18em]">
            No image
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={buildProxyImageUrl(src)}
      alt={alt}
      width={112}
      height={112}
      className="h-full w-full object-contain p-3"
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}
