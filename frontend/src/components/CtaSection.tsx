import React from "react";
import { Button } from "./Button";

interface Props {}

export function CtaSection({}: Props) {
  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Optimize Your Financial Risk Management?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Schedule a demo with our team to see how Prism ALM can transform your institution's approach to asset-liability management.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button size="lg" className="bg-white text-primary font-medium hover:bg-gray-100">
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}