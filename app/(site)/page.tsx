import Hero from "@/app/components/home/Hero";
import SearchBar from "@/app/components/search/SearchBar";
import CategoryGrid from "@/app/components/home/CategoryGrid";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import PromoBanner from "@/app/components/home/PromoBanner";
import PopularProducts from "@/app/components/home/PopularProducts";
import BrandStrip from "@/app/components/home/BrandStrip";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import {
  getBrands,
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  getSiteInfo,
} from "@/lib/api";
import VisitUs from "@/app/components/home/VisitUs";

export default async function Home() {
  const [site, categories, featured, popular, brands] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getFeaturedProducts(4),
    getPopularProducts(4),
    getBrands(),
  ]);

  return (
    <>
      <Hero site={site} />
      
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <SearchBar />
        </div>
      <section className="bg-surface">
      <CategoryGrid categories={categories} />
      </section>
      <FeaturedProducts products={featured} whatsapp={site.whatsapp} />
      <section className="bg-surface">
      <PromoBanner promo={site.promo} />
      </section>
      <PopularProducts products={popular} whatsapp={site.whatsapp} />
      <BrandStrip brands={brands} />
      <WhyChooseUs  />
      <section className="bg-surface">
      <VisitUs site={site} />
      </section>
    </>
  );
}