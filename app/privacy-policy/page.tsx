import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Postilio',
  other: {
    'tiktok-developers-site-verification': 'yEYIOGd0wknrNXBqwAQRiXSGA5igJxNt',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 py-12 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <p><strong>Effective Date:</strong> January 1, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Introduction and Ownership</h2>
          <p>
            Postilio ("we", "us", or "our") is owned and operated by <strong>VARNI ENTERPRISE</strong>. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our social media management services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information that you voluntarily give to us when you register with the Service.</li>
            <li><strong>Third-Party Social Media Data:</strong> If you connect your account to third-party social networks (such as TikTok, LinkedIn, Instagram, Facebook), we may collect information from these accounts. For TikTok, this includes your profile information (like username and profile picture), video content, and analytics data authorized by the TikTok API.</li>
            <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage your account.</li>
            <li>Facilitate the scheduling and publishing of content to your connected social media profiles (including TikTok).</li>
            <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Service to you.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          </ul>
          <p>We do not sell your personal data to third parties.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Data Retention and Deletion</h2>
          <p>
            We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          <p>
            <strong>Right to Deletion:</strong> You have the right to request the deletion of your personal data. If you wish to delete your account or any data associated with third-party social networks (such as TikTok data), you may do so within your account settings or by contacting us at <strong>contact@postilio.tech</strong>. Upon request, we will promptly delete your data from our active databases.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <br />
            <strong>Email:</strong> contact@postilio.tech <br />
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
