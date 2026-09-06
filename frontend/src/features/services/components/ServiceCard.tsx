import Button from "../../../components/Button";
import { Service } from "../types/service";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../context/NavigationContext";
import { useLanguage } from "../../../context/LanguageContext";

interface Props {
  service: Service;
  onBook: (service: Service) => void;
  onViewDetails?: (service: Service) => void;
}

function ServiceCard({ service, onBook, onViewDetails }: Props) {
  const { isAuthenticated } = useAuth();
  const { setPage, setRedirectAfterLogin, setSelectedServiceId } = useNavigation();
  const { t, localizeService } = useLanguage();

  const localized = localizeService(service);

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setSelectedServiceId(service.id);
      setRedirectAfterLogin('appointments'); // Remember where to go after login
      setPage('login'); // Redirect to login
    } else {
      onBook(service);
    }
  };

  const imageSrc = service.image || service.imageUrl;

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(service)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md hover:scale-[1.01] transition-all duration-150 cursor-pointer"
    >
      <div className="h-48 bg-gray-100 overflow-hidden relative flex-shrink-0">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={localized.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {t('common.noImage', 'No Image')}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm border border-gray-100">
          {service.price} {t('common.currency', 'ETB')}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold text-gray-800">{localized.name}</h3>
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg whitespace-nowrap">
            {localized.category || t('nav.services', 'Service')}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">{localized.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-5">
          <span className="font-medium mr-1 text-gray-400">{t('common.duration', 'Duration')}:</span> {service.durationMinutes ?? service.duration ?? 45} {t('common.mins', 'mins')}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleBookClick}
            className="w-full justify-center"
          >
            {t('landing.bookNow', 'Book Now')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;