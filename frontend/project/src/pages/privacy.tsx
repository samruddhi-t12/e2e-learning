import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 leading-7">
          <p>
            At <span className="font-semibold">E2E Learning</span>, your privacy is important to us.
            This Privacy Policy explains how we collect, use, and safeguard your personal information
            when you use our platform and services.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Information We Collect</h2>
            <p>
              We may collect personal details such as your name, email address, payment-related details,
              and account information when you register, purchase study materials, or contact support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Use Your Information</h2>
            <p>
              Your information is used to provide access to purchased content, process transactions,
              improve user experience, send important service updates, and respond to support requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Services</h2>
            <p>
              Payments and certain services may be handled by trusted third-party providers.
              We do not store sensitive payment information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at:
              <span className="font-medium"> samruddhithorat1356@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;