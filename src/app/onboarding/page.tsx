import type { Metadata } from "next";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

/* Deliberately out of the index: this is a link we send to signed clients, not
   a page we want ranking. The form itself is a client component because every
   answer, and the fork between the two tracks, lives in local state. */
export const metadata: Metadata = {
  title: "Client onboarding | GrowingOffers",
  description:
    "The questions we need answered before we build your offer and launch it.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingForm />;
}
