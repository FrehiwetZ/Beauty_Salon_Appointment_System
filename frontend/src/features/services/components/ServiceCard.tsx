import React from "react";
import Button from "../../../components/Button";
import { Service } from "../types/service";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../context/NavigationContext";

interface Props {
  service: Service;
  onBook: (service: Service) => void;
}

function ServiceCard({ service, onBook }: Props) {
  const { isAuthenticated } = useAuth();
  const { setPage, setRedirectAfterLogin, setSelectedServiceId } = useNavigation();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setSelectedServiceId(service.id);
      setRedirectAfterLogin('appointments'); // Remember where to go after login
      setPage('login'); // Redirect to login
    } else {
      onBook(service);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md hover:scale-[1.01] transition-all duration-150">
      <div className="h-48 bg-gray-100 overflow-hidden relative flex-shrink-0">
        {service.image || service.imageUrl ? (
          <img 
            src={service.image || service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm border border-gray-100">
          ${service.price}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg whitespace-nowrap">
            {service.category || "Service"}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 flex-grow">{service.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-5">
          <span className="font-medium mr-1 text-gray-400">Duration:</span> {service.durationMinutes ?? service.duration} mins
        </div>
        
        <Button 
          onClick={handleBookClick}
          className="w-full justify-center"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default ServiceCard;