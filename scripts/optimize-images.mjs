import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "assets/brand");
const out = path.join(root, "public/brand");

await mkdir(out, { recursive: true });

const navy = { r: 7, g: 17, b: 31, alpha: 1 };

async function emit(inputName, width, basename) {
  const input = path.join(source, inputName);
  const resized = sharp(input).resize({ width, withoutEnlargement: true });
  await resized.clone().webp({ quality: 84, alphaQuality: 92 }).toFile(path.join(out, `${basename}.webp`));
  await resized.clone().png({ compressionLevel: 9, effort: 10 }).toFile(path.join(out, `${basename}.png`));
  const info = await sharp(path.join(out, `${basename}.png`)).metadata();
  console.log(`${basename}.png ${info.width}x${info.height}`);
}

await emit("logo-plain.png", 960, "logo-plain");
await emit("logo-wordmark.png", 960, "logo-wordmark");
await emit("banner-wide.png", 1800, "banner-wide");
await emit("banner-wide.png", 800, "banner-wide-sm");
await emit("banner-telegram.png", 1100, "banner-telegram");

await sharp(path.join(out, "banner-telegram.png"))
  .png({ compressionLevel: 9 })
  .toFile(path.join(out, "og.png"));

for (const size of [32, 192]) {
  await sharp(path.join(source, "logo-plain.png"))
    .resize(size, size, { fit: "cover" })
    .flatten({ background: navy })
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, `favicon-${size}.png`));
}

await sharp(path.join(source, "logo-plain.png"))
  .resize(180, 180, { fit: "cover" })
  .flatten({ background: navy })
  .png({ compressionLevel: 9 })
  .toFile(path.join(out, "apple-touch.png"));

console.log("Brand images written to public/brand");
