import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 9, 2025</p>

          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                AlaskaPay ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Name, email address, phone number</li>
                <li>Government-issued ID and verification documents</li>
                <li>Bank account and payment information</li>
                <li>Transaction history and payment details</li>
                <li>Profile photo and biometric data (if enabled)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data and analytics</li>
                <li>Location information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-2">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Send you updates, security alerts, and support messages</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Provide customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-2">We may share your information with:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors and financial institutions</li>
                <li>Law enforcement when required by law</li>
                <li>Third parties with your consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, 
                and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                Transaction records are retained for at least 7 years as required by financial regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Lodge a complaint with data protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. 
                You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these sites. 
                We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                AlaskaPay is not intended for users under 18 years of age. We do not knowingly collect information from children. 
                If we discover that a child has provided us with personal information, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards 
                are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Changes to Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through 
                the Service. Your continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about this Privacy Policy or to exercise your rights, contact us at:<br />
                Email: privacy@alaskapay.com<br />
                Address: AlaskaPay Inc., 123 Financial District, Lagos, Nigeria<br />
                Data Protection Officer: dpo@alaskapay.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
