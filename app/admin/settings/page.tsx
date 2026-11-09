import SettingsForm from "@/app/components/admin/SettingsForm";
import { getCategories, getSiteInfo } from "@/lib/api";

export default async function SettingsPage() {
  const [site, categories] = await Promise.all([getSiteInfo(), getCategories()]);

  return (
    <SettingsForm
      site={site}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
    />
  );
}