import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import FashionSection from "@/components/FashionSection";
import StepIntoLight from "@/components/StepIntoLight";
import MosaicCategoryTransition from "@/components/MosaicCategoryTransition";
import Footer from "@/components/Footer";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-white">
      {/* 3D Cinematic Hero Component */}
      <Hero heroImage='./lehengas.jpg' />

      {/* Slipstream Entrance Gallery 1 */}
      <Showcase 
        marqueeText="New Arrivals"
        className="pt-32 pb-8"
        direction="right" 
        duration={12} 
        products={[
          { id: 1, title: 'Royal Baluchari Silk Saree', image: '/saree1.jpeg' },
  { id: 2, title: 'Midnight Dhakai Jamdani', image: '/saree2.jpeg' },
  { id: 3, title: 'Heritage Kantha Stitch Saree', image: '/saree3.jpeg' },
  { id: 4, title: 'Midnight Silk Kurta', image: '/kurta1.jpg' },
  { id: 5, title: 'Ivory Chikankari Overlay', image: '/kurta2.jpg' },
  { id: 6, title: 'Onyx Asymmetric Drape', image: '/kurta3.jpg' },
  { id: 7, title: 'Crimson Bridal Lehenga', image: '/lehenga1.jpg' },
  { id: 8, title: 'Ivory Floral Organza Lehenga', image: '/lehenga2.jpg' },
  { id: 9, title: 'Ivory Pearl Kurti', image: '/kurti1.jpg' },
  { id: 10, title: 'Royal Navy Velvet Kurti', image: '/kurti2.jpg' },
        ]}
      />

      {/* Slipstream Entrance Gallery 2 */}
      <Showcase 
        marqueeText="Trending Collection"
        className="pt-8 pb-32"
        direction="left" 
        duration={16} 
        products={[
          { id: 11, title: 'Kanjeevaram Temple Border Saree', image: '/saree8.jpeg' },
  { id: 12, title: 'Banarasi Zari Brocade Saree', image: '/saree7.jpeg' },
  { id: 13, title: 'Ivory Organza Couture Saree', image: '/saree4.jpeg' },
  { id: 14, title: 'Nawab Angrakha Wrap Kurta', image: '/kurta4.jpg' },
  { id: 15, title: 'Bengal Loom Short Kurta', image: '/kurta5.jpg' },
  { id: 16, title: 'Mustard Linen Tunic Kurta', image: '/kurta6.jpg' },
  { id: 17, title: 'Midnight Velvet Lehenga', image: '/lehenga3.jpg' },
  { id: 18, title: 'Pastel Mint Net Drape Lehenga', image: '/lehenga4.jpg' },
  { id: 19, title: 'Gold Brocade Kurti', image: '/kurti3.jpg' },
  { id: 20, title: 'Emerald Festive Kurti', image: '/kurti4.jpg' }
        ]}
      />

      {/* Step Into Light — cinematic bridge text in the dark gap */}
      <StepIntoLight />

      {/* Fashion Section */}
      <FashionSection />

      {/* Horizontal Transition: Tactile Cube -> Full Collection Grid */}
      <MosaicCategoryTransition />

      {/* Senior UI Footer */}
      <Footer />

    </main>
  );
}
