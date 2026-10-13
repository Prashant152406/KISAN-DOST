import React from "react";
import { Leaf, MessageCircle } from "lucide-react";

const Footer = () => {
  const governmentLinks = [
    {
      hindi: "भारतीय कृषि अनुसंधान परिषद",
      english: "Indian Council Of Agricultural Research",
      url: "https://icar.gov.in/",
    },
    {
      hindi: "भारतीय कृषि सांख्यिकी अनुसंधान संस्थान",
      english: "Indian Agricultural Statistics Research Institute",
      url: "https://iasri.icar.gov.in/",
    },
    {
      hindi: "डिजिटल इंडिया कॉर्पोरेशन",
      english:
        "Digital India Corporation Ministry of Electronics & Information Technology",
      url: "https://dic.gov.in/",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Information Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Information</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#markethub"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  MarketHub
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#download"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Download Brochure
                </a>
              </li>
            </ul>
          </div>

          {/* Government Sites Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Government Sites</h3>
            <ul className="space-y-3">
              {governmentLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    <div className="text-green-400">{link.hindi}</div>
                    <div>{link.english}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Social Media</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Google Translate */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Language / भाषा</h4>
              <div
                id="google_translate_element"
                className="bg-white rounded-lg p-2"
              ></div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Kisan Dost</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Kisan Dost. All rights reserved. Empowering farmers with
            technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
