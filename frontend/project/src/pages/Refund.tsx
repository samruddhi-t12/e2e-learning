import React from 'react';

const Refund = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Refund & Cancellation Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 leading-7">
          <p>
            At <span className="font-semibold">E2E Learning</span>, we provide digital educational
            products such as PDF notes and study materials. Since these are non-tangible digital goods,
            purchases are generally non-refundable once access is granted.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Digital Product Policy</h2>
            <p>
              Refunds are not applicable after successful purchase, download, or unlocking of digital content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Eligible Refund Cases</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment completed but product access was not provided.</li>
              <li>Duplicate payment for the same product.</li>
              <li>Technical issue preventing access, unresolved by support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Refund Request Timeline</h2>
            <p>
              Refund requests must be submitted within <span className="font-semibold">3 days</span> of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h2>
            <p>
              For refund-related issues, contact us at:
              <span className="font-medium"> samruddhithorat1356@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Refund;