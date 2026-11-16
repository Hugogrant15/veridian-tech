/**
 * Makes small WebP copies of every photo and screenshot in public/work, so a
 * phone downloads a 480px image and not the 1440px original.
 *
 * Run `npm run images` after adding or replacing an image there, and commit
 * what it writes: the .webp files and src/config/image-manifest.json, which
 * tells <Shot> (src/components/ui.tsx) which sizes exist for each image.
 */
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const WIDTHS = [480, 960];

const manifest = {};
const files = (await readdir(join(PUBLIC, "work"), { recursive: true, withFileTypes: true }))
  .filter((f) => f.isFile() && /\.(jpe?g|png)$/i.test(f.name))
  .map((f) => join(f.parentPath, f.name))
  .sort();

for (const file of files) {
  const { width, height } = await sharp(file).metadata();
  // The listed sizes, plus one at the original width, never upscaled.
  const widths = [...WIDTHS.filter((w) => w < width), width];
  for (const w of widths) {
    await sharp(file).resize({ width: w }).webp({ quality: 78 }).toFile(file.replace(/\.\w+$/, `-${w}.webp`));
  }
  manifest[`/${relative(PUBLIC, file).replaceAll("\\", "/")}`] = { width, height, widths };
}

await writeFile(join(ROOT, "src", "config", "image-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote WebP sizes for ${files.length} images.`);
