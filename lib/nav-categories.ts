// Temporary list for the menu. Later, replaced by getCategories() from api.ts.
export type NavCategory = { name: string; slug: string };

export const navCategories: NavCategory[] = [
  { name: "Power Tools", slug: "power-tools" },
  { name: "Hand Tools", slug: "hand-tools" },
  { name: "Masonry Tools", slug: "masonry-tools" },
  { name: "Carpentry & Woodwork", slug: "carpentry-woodwork" },
  { name: "Welding Equipment", slug: "welding-equipment" },
  { name: "Measuring & Testing", slug: "measuring-testing" },
  { name: "Cutting & Abrasives", slug: "cutting-abrasives" },
  { name: "Tool Storage", slug: "tool-storage" },
  { name: "Electrical & Lighting", slug: "electrical-lighting" },
  { name: "Solar", slug: "solar" },
  { name: "Plumbing & Bathroom", slug: "plumbing-bathroom" },
  { name: "Cleaning Equipment", slug: "cleaning-equipment" },
  { name: "Batteries & Chargers", slug: "batteries-chargers" },
];