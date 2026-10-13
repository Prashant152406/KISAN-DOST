import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  Leaf,
  ExternalLink,
  Globe,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Award,
  CheckCircle,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

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

  const features = [
    {
      icon: Users,
      title: "10,000+ Farmers",
      description: "Trust our platform daily",
    },
    {
      icon: TrendingUp,
      title: "25% Yield Increase",
      description: "Average improvement with our recommendations",
    },
    {
      icon: Shield,
      title: "Weather Alerts",
      description: "Real-time notifications for crop protection",
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Agricultural specialists at your service",
    },
  ];

  const benefits = [
    "Personalized crop recommendations based on your location",
    "Real-time weather updates and alerts",
    "Direct marketplace access for better prices",
    "Expert agricultural guidance and support",
    "Modern farming techniques and best practices",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <Navbar />

      {/* Google Translate Element */}
      <div
        id="google_translate_element"
        className="fixed top-20 right-4 z-40"
      ></div>

      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden pt-32 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>

        <div className="relative max-w-full mx-auto px-8 sm:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-100 border border-green-200">
                  <Leaf className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium text-sm">
                    India's #1 Agricultural Platform
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                  Empowering
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 block">
                    Indian Farmers
                  </span>
                  <span className="text-4xl md:text-5xl lg:text-6xl text-gray-700">
                    For Success
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Your trusted companion for modern farming solutions,
                  intelligent crop recommendations, and direct marketplace
                  access to maximize your agricultural success.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <feature.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {feature.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => navigate("/recommendations")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-5 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/crop-seasons")}
                  className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-12 py-5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  Explore Crops
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-12 pt-8 border-t border-green-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">10K+</p>
                  <p className="text-sm text-gray-600 mt-1">Active Farmers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">50+</p>
                  <p className="text-sm text-gray-600 mt-1">Crop Varieties</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">25%</p>
                  <p className="text-sm text-gray-600 mt-1">Yield Increase</p>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Image Section */}
            <div className="relative lg:h-[600px]">
              {/* Main Image */}
              <div className="relative z-10 h-full">
                <img
                  src="/home.jpg"
                  alt="Modern farming with technology"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-3xl transform rotate-6 scale-105"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>

              {/* Floating Cards */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-2xl p-5 shadow-xl border border-green-100 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Crop Yield</p>
                    <p className="text-green-600 font-bold">+25% Increase</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-1/4 bg-white rounded-2xl p-5 shadow-xl border border-green-100 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Weather Alert</p>
                    <p className="text-blue-600 font-bold">Real-time Updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Website Background */}
      <section className="py-28 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
              Why Choose Kisan Dost?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of farmers who have transformed their agricultural
              practices with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-5 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white"
              >
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Links - Full Width */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Trusted Government Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with leading government institutions to bring you
              the most reliable agricultural information and support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {governmentLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-green-100 p-5 rounded-2xl group-hover:bg-green-200 transition-colors">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <ExternalLink className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-green-900 transition-colors">
                  {link.hindi}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors mb-6">
                  {link.english}
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span>Visit Website</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section - Full Width */}
      <section className="py-28 bg-gradient-to-br from-gray-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join the agricultural revolution today and discover how technology
              can help you achieve better yields, higher profits, and
              sustainable farming practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button
                onClick={() => navigate("/recommendations")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-14 py-5 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Crop Recommendations
              </button>
              <button
                onClick={() => navigate("/crop-seasons")}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-14 py-5 rounded-xl font-semibold text-lg transition-all"
              >
                Explore Crop Seasons
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
