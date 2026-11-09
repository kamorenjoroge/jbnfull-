// TEMPORARY: reads and writes the JSON files on your computer.
// Only used by server actions. Replaced by Supabase later.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

type DataFile = "categories" | "products" | "brands" | "site";

const dir = path.join(process.cwd(), "lib", "mock-data");

export async function readData<T>(name: DataFile): Promise<T> {
  const raw = await readFile(path.join(dir, `${name}.json`), "utf8");
  return JSON.parse(raw) as T;
}

export async function writeData(name: DataFile, data: unknown) {
  await writeFile(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2) + "\n", "utf8");
}
// TEMPORARY: lists the images in public/images for the product form's picker
export async function listImages(): Promise<string[]> {
  try {
    const files = await readdir(path.join(process.cwd(), "public", "images"));
    return files.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}