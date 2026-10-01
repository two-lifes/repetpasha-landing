import { AboutTeacher } from "@/components/sections/AboutTeacher";
import { CasesAndProofs } from "@/components/sections/CasesAndProofs";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { HeroSection } from "@/components/sections/HeroSection";
import { InteractiveWidgetSection } from "@/components/sections/InteractiveWidgetSection";
import { LeadForm } from "@/components/sections/LeadForm";
import { MethodologySection } from "@/components/sections/MethodologySection";
import { PricingCards } from "@/components/sections/PricingCards";
import { MeshDriftBackground } from "@/components/ui/mesh-drift-background";

function App() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <MeshDriftBackground />
      <HeroSection />
      <MethodologySection />
      <InteractiveWidgetSection />
      <AboutTeacher />
      <CasesAndProofs />
      <PricingCards />
      <FaqAccordion />
      <LeadForm />
    </main>
  );
}

export default App;
