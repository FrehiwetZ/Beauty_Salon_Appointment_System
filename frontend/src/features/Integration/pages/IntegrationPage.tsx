import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import IntegrationCard from '../components/IntegrationCard';
import { mockIntegrations } from '../data/mockIntegrations';

function IntegrationPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const handleToggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return {
          ...int,
          status: int.status === 'Connected' ? 'Disconnected' : 'Connected'
        };
      }
      return int;
    }));
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <p className="text-pink-600 font-medium">Add-ons</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">Integrations</h1>
          <p className="text-gray-600 mt-3">
            Connect your favorite tools to streamline your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map(integration => (
            <IntegrationCard 
              key={integration.id} 
              integration={integration} 
              onToggleStatus={handleToggleStatus} 
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default IntegrationPage;
