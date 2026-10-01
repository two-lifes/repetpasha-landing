import { AboutTeacher } from "@/components/AboutTeacher";
import { CasesAndProofs } from "@/components/CasesAndProofs";
import { FaqAccordion } from "@/components/FaqAccordion";
import { LeadForm } from "@/components/LeadForm";
import { PricingCards } from "@/components/PricingCards";
import { HeroSection } from "@/components/HeroSection";
import { InteractiveWidgetSection } from "@/components/InteractiveWidgetSection";
import { MethodologySection } from "@/components/MethodologySection";
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
