import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";

interface Props {}

export function FeatureSection({}: Props) {
  const features = [
    {
      title: "Account Management",
      description: "Comprehensive tools to manage financial accounts with detailed tracking of balances, rates, terms, and account relationships."
    },
    {
      title: "Transaction Processing",
      description: "Efficient processing and tracking of all financial transactions with advanced categorization and reporting capabilities."
    },
    {
      title: "Risk Assessment",
      description: "Sophisticated risk modeling and analysis tools to identify, measure, and mitigate various financial risks."
    },
    {
      title: "Compliance Monitoring",
      description: "Automated monitoring of regulatory requirements with real-time alerts and comprehensive reporting."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our ALM system provides a comprehensive suite of tools designed specifically for financial institutions.
          </p>
        </div>

        {/* Create a responsive grid layout that changes columns based on screen size */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Map through each feature in the features array and create a card for it */}
          {features.map((feature, index) => (
            // Card component with hover effect - key is required for React lists
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                {/* Display the feature title */}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display the feature description with gray text */}
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}