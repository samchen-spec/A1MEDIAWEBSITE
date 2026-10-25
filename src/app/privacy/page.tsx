import { Metadata } from "next";
import SectionLabel from "@/components/SectionLabel";
import { CONTACT_EMAIL } from "@/lib/site";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy, GrowingOffers",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#000000] text-white">
      <section className="pt-32 py-[60px] md:py-[100px]">
        <div className="mx-auto max-w-[800px] px-6">
          <AnimatedSection>
            <SectionLabel>LEGAL</SectionLabel>
          </AnimatedSection>

          <AnimatedSection>
            <h1 className="mt-6 text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#D2CEC9" }}>
              Last Updated: March 2026
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mt-10 max-w-3xl">

              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                GrowingOffers (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website growingoffers.com (the &quot;Site&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site or submit an application. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Site.
              </p>

              {/* 1 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We may collect the following information when you use our Site or submit an application:
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                <strong className="text-white">Personal Data:</strong> Name, email address, social media handles, and any other information you voluntarily provide through application forms or direct communication.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                <strong className="text-white">Usage Data:</strong> Information automatically collected when you visit the Site, including IP address, browser type, operating system, referring URLs, pages visited, and time spent on pages.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                <strong className="text-white">Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track activity on our Site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              {/* 2 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We use the information we collect to: review and process partnership applications, communicate with you about potential opportunities, improve our Site and services, send marketing communications (with your consent), analyse usage patterns and Site performance, prevent fraud and protect our legal rights, comply with legal obligations.
              </p>

              {/* 3 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                3. Disclosure of Your Information
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We may share your information with: service providers who assist in operating our Site and business (payment processors, email platforms, analytics providers), legal authorities if required by law or to protect our rights, a successor entity in the event of a merger, acquisition, or business transfer. We do not sell your personal information to third parties.
              </p>

              {/* 4 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                4. Security of Your Information
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We use commercially reasonable measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>

              {/* 5 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                5. Third-Party Websites
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>

              {/* 6 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                6. Children&apos;s Privacy
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                Our Site is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal information, we will delete it promptly.
              </p>

              {/* 7 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                7. Your Rights
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                Depending on your jurisdiction, you may have the right to: access the personal data we hold about you, request correction or deletion of your data, object to or restrict processing of your data, withdraw consent where processing is based on consent, lodge a complaint with a data protection authority. To exercise any of these rights, contact us at the email address below.
              </p>

              {/* 8 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                8. Changes to This Policy
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. Continued use of the Site after changes constitutes acceptance of the updated policy.
              </p>

              {/* 9 */}
              <h2 className="text-xl font-semibold text-white mt-10 mb-4">
                9. Contact Us
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#D2CEC9" }}>
                If you have questions about this Privacy Policy, contact us at: {CONTACT_EMAIL}
              </p>

            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
