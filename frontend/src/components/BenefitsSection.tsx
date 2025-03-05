import React from "react";

interface Props {}

export function BenefitsSection({}: Props) {
  const benefits = [
    {
      title: "Enhanced Decision Making",
      description: "Access real-time data and advanced analytics to make more informed financial decisions."
    },
    {
      title: "Regulatory Compliance",
      description: "Stay compliant with evolving financial regulations through automated monitoring and reporting."
    },
    {
      title: "Risk Mitigation",
      description: "Identify and address potential risks before they impact your financial position."
    },
    {
      title: "Operational Efficiency",
      description: "Streamline ALM processes and reduce manual work through automation and integration."
    },
    {
      title: "Strategic Planning",
      description: "Develop more effective long-term financial strategies based on comprehensive data analysis."
    },
    {
      title: "Cost Reduction",
      description: "Minimize operational costs and optimize resource allocation across your organization."
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits for Financial Institutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our ALM system delivers significant value across your organization, from daily operations to strategic planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}