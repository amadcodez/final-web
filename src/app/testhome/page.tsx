import TestHeroBanner from "@/app/testcomponents/testHeroBanner"
import TestCategoryGrid from "../testcomponents/testTopCategories";
import TestDealOfWeek from "../testcomponents/testDealOfWeek";
import TestFeaturedCategories from "../testcomponents/testFeaturedCategories";
import TestBanners from "../testcomponents/testBanners";
import TestNavbar from "../testcomponents/TestNavbar";
export default function Home() {
  return (
    <main>
      <TestNavbar />
      <TestHeroBanner />
      <TestCategoryGrid />
      <TestDealOfWeek />
      <TestFeaturedCategories />
      <TestBanners />
    </main>
  );
}
