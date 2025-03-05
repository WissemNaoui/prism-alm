import React from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { FeatureSection } from "../components/FeatureSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { CtaSection } from "../components/CtaSection";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { useAuthStore } from "../utils/auth";

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full py-4 px-6 bg-white border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Prism ALM</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary font-medium">Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-primary font-medium">Benefits</a>
            <a href="#contact" className="text-gray-700 hover:text-primary font-medium">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="default" className="bg-primary text-white font-medium">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-primary text-white font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <BenefitsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
