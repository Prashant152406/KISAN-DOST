import React from "react";

const TransformingAgricultureSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Impact Metrics */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Agriculture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From seed selection to market sales - complete guidance for modern
              farming with AI-powered insights
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { value: "36%", label: "Increase in Farmer Income" },
              { value: "40%", label: "Reduction in Middlemen" },
              { value: "100M+", label: "Target Farmer Base" },
              { value: "24/7", label: "AI Support Available" },
            ].map(({ value, label }, i) => (
              <div
                key={i}
                className="text-center border-2 border-green-600 text-green-600 p-8 rounded-2xl shadow-lg hover:bg-green-50 transition-colors cursor-default"
                style={{
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text-3xl font-bold mb-2">{value}</div>
                <div className="text-sm opacity-90">{label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">
                🌱 Environmental Impact
              </h4>
              <p className="text-gray-600 text-sm">
                Promoting sustainable farming through optimized fertilizer,
                pesticide, and water usage recommendations
              </p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">
                📱 Digital Inclusion
              </h4>
              <p className="text-gray-600 text-sm">
                Bridging the digital divide with multilingual voice chatbot and
                offline/SMS fallback options
              </p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">
                ⚡ Scalable Solution
              </h4>
              <p className="text-gray-600 text-sm">
                Modular architecture enabling growth from district-level
                implementation to nationwide adoption
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformingAgricultureSection;
