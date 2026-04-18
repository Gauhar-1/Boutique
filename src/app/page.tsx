import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import FashionSection from "@/components/FashionSection";
import StepIntoLight from "@/components/StepIntoLight";
import MosaicCategoryTransition from "@/components/MosaicCategoryTransition";
import Footer from "@/components/Footer";

export default async function Home() {
  let message = "Loading...";

  try {
    const res = await fetch('http://127.0.0.1:5001/api/health', {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Backend returned status: ${res.status}`);
    }

    const data = await res.json();
    message = data.message;

  } catch (error) {
    console.error("Fetch failed:", error);
    message = "Could not connect to the backend server. Is it running?";
  }

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
          { id: 1, title: 'Saree 01', image: '/saree1.jpeg' },
          { id: 2, title: 'Saree 02', image: '/saree2.jpeg' },
          { id: 3, title: 'Saree 03', image: '/saree3.jpeg' },
          { id: 4, title: 'Kurta 01', image: '/kurta1.jpg' },
          { id: 5, title: 'Kurta 02', image: '/kurta2.jpg' },
          { id: 6, title: 'Kurta 03', image: '/kurta3.jpg' },
          { id: 7, title: 'Lehenga 01', image: '/lehenga1.jpg' },
          { id: 8, title: 'Lehenga 02', image: '/lehenga2.jpg' },
          { id: 9, title: 'Kurti 01', image: '/kurti1.jpg' },
          { id: 10, title: 'Kurti 02', image: '/kurti2.jpg' },
        ]}
      />

      {/* Slipstream Entrance Gallery 2 */}
      <Showcase 
        marqueeText="Trending Collection"
        className="pt-8 pb-32"
        direction="left" 
        duration={16} 
        products={[
          { id: 11, title: 'Saree 04' , image: '/saree8.jpeg'},
          { id: 12, title: 'Saree 05' , image: '/saree7.jpeg'},
          { id: 13, title: 'Saree 06' , image: '/saree4.jpeg'},
          { id: 14, title: 'Kurta 04' , image: '/kurta4.jpg'},
          { id: 15, title: 'Kurta 05' , image: '/kurta5.jpg'},
          { id: 16, title: 'Kurta 06' , image: '/kurta6.jpg'},
          { id: 17, title: 'Lehenga 03' , image: '/lehenga3.jpg'},
          { id: 18, title: 'Lehenga 04' , image: '/lehenga4.jpg'},
          { id: 19, title: 'Kurti 03' , image: '/kurti3.jpg'},
          { id: 20, title: 'Kurti 04' , image: '/kurti4.jpg'},
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
