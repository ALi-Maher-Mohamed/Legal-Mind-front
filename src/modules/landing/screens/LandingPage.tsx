import { Navbar, Footer } from '@/components/layouts';
import Hero from '../sections/hero/Hero';
import AIAssistantPreview from '../sections/ai-assistant/AIAssistantPreview';
import ServicesList from '../sections/services/ServicesList';
import Stats from '../sections/stats/Stats';
import Pricing from '../sections/pricing/Pricing';
import Testimonials from '../sections/testimonials/Testimonials';
import FAQ from '../sections/faq/FAQ';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AIAssistantPreview />
        <ServicesList />
        <Stats />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
