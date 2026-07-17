#!/usr/bin/env node
/**
 * upload-brand-assets.mjs — one-time upload of the generated V1.5 brand
 * imagery to Cloudinary.
 *
 * Every asset here already ships as a working local fallback under
 * public/images/** (see src/config/images.ts and
 * src/components/shared/BrandImage.tsx) — this script is purely an
 * upgrade path: once you have a real Cloudinary account, run
 *
 *   npm run assets:upload
 *
 * with CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 * set (see .env.example), and every `BrandImage` call site will
 * automatically start serving the Cloudinary-hosted, optimized version
 * instead — no code changes needed, as long as
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is also set so the client knows to
 * request it.
 *
 * Each entry's `publicId` matches the `cloudinaryPublicId` already
 * recorded against that asset in src/config/images.ts — keep the two in
 * sync if you rename or add an asset.
 */
import { v2 as cloudinary } from "cloudinary";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const ASSETS = [
  { file: "images/hero/hero-main.png", publicId: "mystery-hub/hero-main" },
  { file: "images/banners/referral-banner.png", publicId: "mystery-hub/referral-banner" },
  { file: "images/logos/og-image.png", publicId: "mystery-hub/og-image" },
  { file: "images/utilities/empty-wallet.png", publicId: "mystery-hub/empty-wallet" },
  { file: "images/utilities/empty-orders.png", publicId: "mystery-hub/empty-orders" },
  { file: "images/utilities/empty-referrals.png", publicId: "mystery-hub/empty-referrals" },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    console.error(
      "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET " +
        "(see .env.example) before running this script."
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  cloudinary.config({
    cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnv("CLOUDINARY_API_KEY"),
    api_secret: requireEnv("CLOUDINARY_API_SECRET"),
  });

  let failures = 0;

  for (const asset of ASSETS) {
    const absolutePath = path.join(PUBLIC_DIR, asset.file);
    if (!existsSync(absolutePath)) {
      console.error(`✗ ${asset.file} — file not found, skipping`);
      failures += 1;
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(absolutePath, {
        public_id: asset.publicId,
        overwrite: true,
        resource_type: "image",
      });
      console.log(`✓ ${asset.file} -> ${result.public_id} (${result.secure_url})`);
    } catch (error) {
      console.error(`✗ ${asset.file} — upload failed:`, error?.message ?? error);
      failures += 1;
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} of ${ASSETS.length} asset(s) failed to upload.`);
    process.exit(1);
  }

  console.log(
    `\nAll ${ASSETS.length} assets uploaded. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${process.env.CLOUDINARY_CLOUD_NAME} ` +
      "in your env to start serving them via Cloudinary."
  );
}

main();
