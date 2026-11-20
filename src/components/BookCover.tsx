import { useState } from "react";
import { getCoverImageUrl } from "../utils/image.ts";

interface BookCoverProps {
  coverUrl?: string;
  bookId?: number;
  title: string;
  className?: string;
  heightClass?: string;
}

export function BookCover({
  coverUrl,
  bookId,
  title,
  className = "w-full rounded-xl object-cover",
  heightClass = "h-64",
}: BookCoverProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  const proxyUrl = getCoverImageUrl(coverUrl, bookId);
  const src = useFallback ? coverUrl : proxyUrl;

  if (hasError || !src) {
    return (
      <div
        className={`skeleton flex ${heightClass} w-full items-center justify-center rounded-xl text-sm opacity-60`}
      >
        ไม่มีรูปปก
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      referrerPolicy="no-referrer"
      className={`${heightClass} ${className}`}
      onError={() => {
        if (!useFallback && coverUrl) {
          setUseFallback(true);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

