import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 9, 2025</p>

          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using AlaskaPay ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these Terms of Service, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Account Registration</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                To use AlaskaPay, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old to use AlaskaPay. By using our Service, you represent and warrant that you meet this requirement 
                and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Financial Services</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                AlaskaPay provides digital wallet, payment processing, virtual cards, and bill payment services. You acknowledge:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Transaction limits apply based on your KYC verification level</li>
                <li>Fees may apply to certain transactions and services</li>
                <li>Transactions may be subject to review for fraud prevention</li>
                <li>We reserve the right to refuse or reverse any transaction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. KYC and Verification</h2>
              <p className="text-gray-700 leading-relaxed">
                We are required by law to verify your identity. You agree to provide accurate identification documents and information when requested. 
                Failure to complete KYC verification may result in account limitations or suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Use the Service for illegal activities or money laundering</li>
                <li>Violate any laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Create multiple accounts to circumvent limits</li>
                <li>Engage in fraudulent transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Fees and Charges</h2>
              <p className="text-gray-700 leading-relaxed">
                AlaskaPay may charge fees for certain services. All applicable fees will be disclosed before you complete a transaction. 
                We reserve the right to modify our fee structure with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these terms, suspicious activity, 
                or as required by law. You may close your account at any time by contacting support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                AlaskaPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use 
                or inability to use the Service. Our total liability shall not exceed the amount of fees paid by you in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify you of significant changes via email or 
                through the Service. Continued use after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, please contact us at:<br />
                Email: legal@alaskapay.com<br />
                Address: AlaskaPay Inc., 123 Financial District, Lagos, Nigeria
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
