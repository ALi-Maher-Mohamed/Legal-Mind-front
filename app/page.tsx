import React from "react";
import { Navbar, Footer } from "@/components/layouts";
import {
  Hero,
  AIAssistantPreview,
  ServicesList,
  Stats,
  FAQ,
  Pricing,
} from "@/modules/landing";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <Hero />
        <AIAssistantPreview />
        <ServicesList />
        <Stats />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
