import React from "react";
import { Button } from "./Button";

interface Props {}

// HeroSection component that displays the main hero/banner area of the landing page
export function HeroSection({}: Props) {
  return (
    // Main section with padding and gradient background
    <section className="py-20 bg-gradient-to-br from-white to-gray-100">
      {/* Container with horizontal padding for content alignment */}
      <div className="container mx-auto px-6">
        {/* Flex container that stacks vertically on mobile, side-by-side on medium screens */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Left column - takes full width on mobile, half width on medium screens */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            {/* Main headline with responsive text sizing */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Comprehensive Asset-Liability Management for Financial Institutions
            </h1>
            {/* Subheading with gray text */}
            <p className="text-xl text-gray-600 mb-8">
              Optimize your balance sheet, manage risk, and ensure regulatory compliance with our advanced ALM solution.
            </p>
            {/* Button container - stacked on small screens, side-by-side on medium and up */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Primary action button */}
              <Button size="lg" className="bg-primary text-white font-medium">
                Get Started
              </Button>
              {/* Secondary action button (outlined style) */}
              <Button size="lg" variant="outline" className="font-medium">
                Learn More
              </Button>
            </div>
          </div>
          {/* Right column - takes full width on mobile, half width on medium screens */}
          <div className="w-full md:w-1/2">
            {/* Card with shadow and border */}
            <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
              {/* Container with 16:9 aspect ratio and gradient background */}
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                {/* Centered content */}
                <div className="text-center">
                  {/* Product name in large, bold primary color text */}
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