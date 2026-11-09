"use server";

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { siteSchema, type SiteFormValues } from "@/lib/schemas";

// TEMPORARY: saves to site.json on your computer. Replaced by a Supabase update later.
export async function saveSiteInfo(data: SiteFormValues): Promise<{ ok: boolean; error?: string }> {
  const parsed = siteSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Some fields are not valid. Check the red messages." };

  try {
    const file = path.join(process.cwd(), "lib", "mock-data", "site.json");
    await writeFile(file, JSON.stringify(parsed.data, null, 2) + "\n", "utf8");
  } catch {
    return { ok: false, error: "Could not save. Saving to the file only works on your computer." };
  }

  revalidatePath("/", "layout"); // refresh the shop pages
  return { ok: true };
}