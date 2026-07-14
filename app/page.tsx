// app/page.tsx
import React from 'react';
import { Navbar, Footer } from '@/components/layouts';
import {
  Hero,
  AIAssistantPreview,
  ServicesList,
  Stats,
  FAQ,
  Pricing,
  Testimonials
} from '@/modules/landing';

export default function HomePage() {
  return (
    <>
      {/* Sticky Header Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. AI Assistant Preview Simulator */}
        <AIAssistantPreview />

        {/* 3. Services Grid Section */}
        <ServicesList />

        {/* 4. Why Choose Us Statistics */}
        <Stats />

        {/* 5. Pricing Plan Tier Cards */}
        <Pricing />

        {/* 6. Testimonials Autoplay Slider */}
        <Testimonials />

        {/* 7. FAQ Accordion Search List */}
        <FAQ />
      </main>

      {/* Footer Details */}
      <Footer />
    </>
  );
}