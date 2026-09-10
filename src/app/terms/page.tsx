import { Metadata } from "next";
import SectionLabel from "@/components/SectionLabel";
import { CONTACT_EMAIL } from "@/lib/site";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms of Service, A1 Media",
};

export default function TermsPage() {
  return (
    <main className="bg-[#000000] text-white">
      <section className="pt-32 py-[60px] md:py-[100px]">
        <div className="mx-auto max-w-[800px] px-6">
          <AnimatedSection>
            <SectionLabel>LEGAL</SectionLabel>
          </AnimatedSection>

          <AnimatedSection>
            <h1 className="mt-6 text-4xl md:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#D2CEC9" }}>
              Last Updated: March 2026
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mt-10 max-w-3xl">

              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                Please read these Terms of Service (&quot;Terms&quot;) carefully before using the growingoffers.com website (the &quot;Site&quot;) operated by A1 Media (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
              </p>

              {/* 1 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Use of the Site
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                You may use the Site for lawful purposes only. You agree not to use the Site in any way that violates applicable laws or regulations, or to attempt to interfere with the proper functioning of the Site.
              </p>

              {/* 2 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. Intellectual Property
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                All content on the Site, including text, graphics, logos, images, and software, is the property of A1 Media or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Site without our prior written consent.
              </p>

              {/* 3 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. No Guarantees of Results
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                A1 Media provides marketing, offer creation, funnel building, and paid acquisition services to its partners. While we have a strong track record, we do not guarantee specific financial outcomes, revenue figures, or business results. Past performance of other partnerships does not guarantee future results. Individual outcomes depend on a variety of factors including niche, audience, market conditions, and the effort contributed by the partner.
              </p>

              {/* 4 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                The Site and its content are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components.
              </p>

              {/* 5 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Limitation of Liability
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                To the fullest extent permitted by law, A1 Media shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or any services discussed on the Site. Our total liability shall not exceed the amount you have paid to us, if any, in the twelve months preceding the claim.
              </p>

              {/* 6 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Indemnification
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                You agree to indemnify and hold harmless A1 Media, its officers, directors, employees, and agents from any claims, losses, liabilities, damages, costs, or expenses (including legal fees) arising from your use of the Site or violation of these Terms.
              </p>

              {/* 7 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Third-Party Links
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                The Site may contain links to third-party websites or services not owned or controlled by A1 Media. We have no control over and assume no responsibility for the content, policies, or practices of any third-party sites.
              </p>

              {/* 8 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. Governing Law
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to conflict of law principles.
              </p>

              {/* 9 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Changes to These Terms
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We reserve the right to modify these Terms at any time. Changes will be effective when posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the Site after changes constitutes acceptance of the revised Terms.
              </p>

              {/* 10 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                10. Contact Us
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                If you have questions about these Terms, contact us at: {CONTACT_EMAIL}
              </p>

            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
