import Footer from "./components/HomePage/Footer";
import NFTSection from "./components/HomePage/NftSection";
import Partners from "./components/HomePage/Partners";
import Hero from "./components/HomePage/Hero";
import Daily from "./components/HomePage/Daily";
import NewsPage from "./components/HomePage/NewsPage";
import ClaimDailyReward from "./daily-reward/ClaimDailyReward";

export default function App() {
  return (
    <main className="mt-20">
      <Hero />
      <div className="bg-dark-700">
        <NFTSection />
        <Daily />
        <ClaimDailyReward />
        <NewsPage />
        <Partners />
        <Footer />
      </div>
    </main>
  );
}
