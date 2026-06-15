export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 py-12 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <p><strong>Effective Date:</strong> January 1, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Ownership and Operation</h2>
          <p>
            Postilio is owned and operated by <strong>VARNI ENTERPRISE</strong>. 
            Throughout this Privacy Policy, "we", "us", and "our" refer to VARNI ENTERPRISE.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, 
            update your profile, use our services, or communicate with us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            to process transactions, to send you related information, and to monitor and analyze 
            trends, usage, and activities in connection with our services.
          </p>
        </section>

        {/* <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Meta Verification Details</h2>
          <p>
            This website and its associated services are registered under the legal entity <strong>VARNI ENTERPRISE</strong>. 
            Our registered business address is: GF-92, VANMALI PARK SOCIETY, PUNAGAM, SURAT, GUJARAT 395010.
          </p>
        </section> */}

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <br />
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
