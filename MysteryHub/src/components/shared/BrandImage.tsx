"use client";

/**
 * BrandImage — renders a typed `ImageEntry` (src/config/images.ts).
 *
 * If `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is configured *and* the entry has
 * a `cloudinaryPublicId`, renders via `next-cloudinary`'s `CldImage`
 * (Cloudinary-hosted, with automatic format/quality optimization).
 * Otherwise falls back to a plain `next/image` pointed at the local
 * `public/images/**` file already committed to the repo — so every image
 * on the site works today, with zero external configuration, and upgrades
 * to Cloudinary delivery the moment `npm run assets:upload` has been run
 * and the env var is set. See docs/product-audit.md ("Phase 7 — Visual
 * assets") for the full rationale.
 */
import * as React from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { env, isCloudinaryDeliveryConfigured } from "@/config/env";
import type { ImageEntry } from "@/types/brand";
import { cn } from "@/lib/utils";

interface BrandImageProps {
  image: ImageEntry;
  className?: string;
  /** Forwarded to next/image and CldImage. Defaults to false. */
  priority?: boolean;
  /** Use `fill` layout (parent must be `position: relative`) instead of
   * the entry's fixed width/height. */
  fill?: boolean;
  sizes?: string;
}

export function BrandImage({
  image,
  className,
  priority = false,
  fill = false,
  sizes,
}: BrandImageProps) {
  const useCloudinary = isCloudinaryDeliveryConfigured && Boolean(image.cloudinaryPublicId);

  if (useCloudinary) {
    return (
      <CldImage
        src={image.cloudinaryPublicId as string}
        alt={image.alt}
        config={{ cloud: { cloudName: env.cloudinaryCloudName } }}
        className={cn("object-cover", className)}
        priority={priority}
        {...(fill
          ? { fill: true, sizes }
          : { width: image.width ?? 1200, height: image.height ?? 630 })}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      className={cn("object-cover", className)}
      priority={priority}
      {...(fill
        ? { fill: true, sizes }
        : { width: image.width ?? 1200, height: image.height ?? 630 })}
    />
  );
}
