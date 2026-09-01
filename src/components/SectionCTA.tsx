import CTAButton from "@/components/CTAButton";
import AnimatedSection from "@/components/AnimatedSection";

/* The recurring "Schedule My Call" that closes each section and anchors back to
   the application in the hero. */
export default function SectionCTA() {
  return (
    <AnimatedSection className="mt-16 flex justify-center md:mt-20">
      <CTAButton href="#schedule">Schedule My Call</CTAButton>
    </AnimatedSection>
  );
}
