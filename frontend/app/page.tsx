"use client";

import NavBar from "@/src/components/NavBar";
import Hero from "@/src/components/Hero";
import Features from "@/src/components/Features";
import Pricing from "@/src/components/Pricing";
import FAQ from "@/src/components/FAQ";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <NavBar/>

      {/* --- HERO SECTION --- */}
      <Hero/>

      {/* --- FEATURES SECTION --- */}
      <Features/>

      {/* --- PRICING SECTION --- */}
      <Pricing/>

      {/* --- FAQ SECTION --- */}
      <FAQ/>

      {/* --- FOOTER --- */}
      <Footer/>
    </div>
  );
}
