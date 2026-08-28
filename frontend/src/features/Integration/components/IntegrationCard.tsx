import React from 'react';
import { Integration } from '../types/integration';
import Button from '../../../components/Button';

interface Props {
  integration: Integration;
  onToggleStatus: (id: string) => void;
}

function IntegrationCard({ integration, onToggleStatus }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{integration.icon}</div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{integration.name}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            integration.status === 'Connected' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {integration.status}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm flex-grow mb-6">{integration.description}</p>
      
      <Button 
        onClick={() => onToggleStatus(integration.id)} 
        variant={integration.status === 'Connected' ? 'secondary' : 'primary'}
        className="w-full justify-center"
      >
        {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}

export default IntegrationCard;
