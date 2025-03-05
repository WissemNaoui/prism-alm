import React from "react";
import { Button } from "./Button";

interface Props {}

export function HeroSection({}: Props) {
  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Comprehensive Asset-Liability Management for Financial Institutions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Optimize your balance sheet, manage risk, and ensure regulatory compliance with our advanced ALM solution.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-primary text-white font-medium">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="font-medium">
                Learn More
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">Prism ALM</div>
                  <p className="text-gray-600">Clarity for Financial Risk Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}