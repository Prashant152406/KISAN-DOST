import React from 'react';

const DigitalEcosystemSection = () => {
  return (
    <section id="digitalecosystem" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Digital Ecosystem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From seed selection to market sales - complete guidance for modern farming with AI-powered insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* AI Services */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Chatbot</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Image recognition for crop disease detection</li>
              <li>• Voice commands in local languages</li>
              <li>• Real-time mandi price updates</li>
              <li>• 24/7 advisory services</li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Multi-modal AI assistance for enhanced accessibility</p>
            </div>
          </div>

          {/* Recommendation System */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Recommendations</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• ML-based crop selection advice</li>
              <li>• Soil, weather & water analysis</li>
              <li>• ROI and yield predictions</li>
              <li>• Fertilizer & irrigation guidance</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Data-driven insights for optimal farming decisions</p>
            </div>
          </div>

          {/* Dual Marketplace */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dual Marketplace</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• B2C & C2C trading models</li>
              <li>• Secure listings & negotiations</li>
              <li>• Escrow payment protection</li>
              <li>• Price comparison tools</li>
            </ul>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">Direct market access eliminating middlemen</p>
            </div>
          </div>

          {/* Crop Management */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Crop Planning</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Kharif, Rabi & Zaid season guidance</li>
              <li>• Seasonal crop calendar</li>
              <li>• Detailed crop profiles</li>
              <li>• Growth cycle tracking</li>
            </ul>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-teal-800 font-medium">Complete crop lifecycle management</p>
            </div>
          </div>

          {/* Trust & Security */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Verification</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Multi-level KYC verification</li>
              <li>• Blockchain traceability</li>
              <li>• Secure UPI/Razorpay payments</li>
              <li>• Rating & dispute resolution</li>
            </ul>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-800 font-medium">Building trust through transparency</p>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Support Services</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>• Weather forecasts & alerts</li>
              <li>• Insurance & loan advisory</li>
              <li>• Government scheme notifications</li>
              <li>• Community forum & rentals</li>
            </ul>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-pink-800 font-medium">Comprehensive farmer support ecosystem</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalEcosystemSection;