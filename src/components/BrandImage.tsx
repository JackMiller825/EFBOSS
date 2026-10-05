import type { ImageAsset } from "../config/site.ts";

export function BrandImage({
  image,
  alt,
  priority = false,
  className,
  srcSet,
  sizes,
}: {
  image: ImageAsset;
  alt: string;
  priority?: boolean;
  className?: string;
  srcSet?: string;
  sizes?: string;
}) {
  return (
    <picture>
      {srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : <source type="image/webp" srcSet={image.webp} />}
      <img
        className={className}
        src={image.png}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
