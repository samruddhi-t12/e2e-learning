import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms and Conditions</h1>
        <div className="space-y-4 text-gray-600">
          <p>Welcome to E2E Learning. By accessing our website, you agree to these terms.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6">1. License and Use</h2>
          <p>Our study materials and notes are provided for personal, non-commercial use only. You may not distribute, modify, or resell our materials.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Payments</h2>
          <p>All payments are processed securely. Access to premium digital content is granted only upon successful payment verification.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Intellectual Property</h2>
          <p>All content included on this site, such as text, graphics, logos, and digital downloads, is the property of E2E Learning and protected by copyright laws.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;