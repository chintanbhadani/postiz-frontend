import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Postilio',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 py-12 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
        
        <p><strong>Effective Date:</strong> January 1, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Postilio ("the Service"), operated by VARNI ENTERPRISE, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
          <p>
            Postilio is a social media management platform that allows users to schedule, manage, and analyze content across various social media platforms, including but not limited to TikTok, LinkedIn, Instagram, and Facebook.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account and password.</li>
            <li>You agree not to use the Service for any illegal or unauthorized purpose, including violating any third-party platform's terms of service (e.g., TikTok's Terms of Service).</li>
            <li>You retain ownership of any content you submit, but you grant us a license to process and transmit it as necessary to provide the Service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. API Usage and Third-Party Services</h2>
          <p>
            Postilio integrates with third-party social media platforms via their respective APIs. By using Postilio, you also agree to be bound by the Terms of Service of those respective platforms. We are not responsible for the availability, features, or policies of these third-party services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without cause or notice, including if we believe you have violated these Terms of Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties of any kind, whether express or implied, including the implied warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
          <p>
            In no event shall VARNI ENTERPRISE be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:<br />
            <strong>Email:</strong> contact@postilio.tech<br />
            <strong>Phone:</strong> +91 9723215104
          </p>
        </section>

        <footer className="pt-12 mt-12 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Postilio. A product of VARNI ENTERPRISE.</p>
        </footer>
      </div>
    </div>
  );
}
