import { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceSearch from "./ServiceSearch";
import ServiceFilter from "./ServiceFilter";
import { Service } from "../types/service";
import { useNavigation } from "../../../context/NavigationContext";
import { useData } from "../../../context/DataContext";
import { useLanguage } from "../../../context/LanguageContext";
import Button from "../../../components/Button";

function ServiceGrid() {
  const { services, staffList } = useData();
  const { t, localizeService, matchServiceCategory, localizeStaff } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [detailedService, setDetailedService] = useState<Service | null>(null);

  const filteredServices = services.filter((service) => {
    const loc = localizeService(service);
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      service.name.toLowerCase().includes(q) ||
      loc.name.toLowerCase().includes(q) ||
      (service.description && service.description.toLowerCase().includes(q)) ||
      loc.description.toLowerCase().includes(q) ||
      loc.category.toLowerCase().includes(q);

    const matchesCategory = matchServiceCategory(service.category, selectedCategory, service.name);

    return matchesSearch && matchesCategory;
  });

  const { setSelectedServiceId, setPage } = useNavigation();

  const handleBook = (service: Service) => {
    setSelectedServiceId(service.id);
    setPage('appointments');
  };

  // Find staff who provide the selected detailed service
  const assignedStaff = detailedService
    ? staffList.filter((s) =>
        s.staffProfile?.services?.some((ss: any) => String(ss.serviceId) === String(detailedService.id)) ||
        s.services?.some((ss: any) => String(ss.serviceId) === String(detailedService.id))
      )
    : [];

  const detailedLoc = detailedService ? localizeService(detailedService) : null;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <ServiceSearch
          search={search}
          setSearch={setSearch}
        />
        <ServiceFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-700">{t('services.noServicesFound', 'No services found matching your criteria.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={handleBook}
              onViewDetails={(s) => setDetailedService(s)}
            />
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {detailedService && detailedLoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => setDetailedService(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer p-1 leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="flex items-start gap-3 sm:gap-4 mb-4 flex-shrink-0 pr-6">
              {detailedService.image || detailedService.imageUrl ? (
                <img
                  src={detailedService.image || detailedService.imageUrl || ""}
                  alt={detailedLoc.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-pink-100 shadow-xs flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
                  ✨
                </div>
              )}
              <div className="flex-grow min-w-0">
                <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full inline-block">
                  {detailedLoc.category || t('nav.services')}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 truncate">
                  {detailedLoc.name}
                </h2>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-gray-700 mt-1 flex-wrap">
                  <span className="text-pink-600">{detailedService.price} {t('common.currency', 'ETB')}</span>
                  <span>•</span>
                  <span className="text-gray-500">⏱ {detailedService.durationMinutes ?? detailedService.duration ?? 45} {t('common.mins', 'mins')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 overflow-y-auto flex-grow pr-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1">
                  {t('common.details', 'Description')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {detailedLoc.description || t('services.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2">
                  {t('services.assignedStylists', 'Specialists For This Service')}
                </h3>
                {assignedStaff.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    {t('services.noStylistsAssigned', 'Any available stylist can perform this service.')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignedStaff.map((staff) => {
                      const staffLoc = localizeStaff(staff);
                      const staffName = `${staff.user?.firstName || staff.firstName || ''} ${staff.user?.lastName || staff.lastName || ''}`.trim();
                      return (
                        <div key={staff.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-pink-50/40 border border-pink-100/60">
                          <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {staffName[0] || 'S'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{staffName}</p>
                            <p className="text-xs text-pink-600 truncate">{staffLoc.position}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-100 pt-3 sm:pt-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setDetailedService(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:underline cursor-pointer text-center"
              >
                {t('common.close', 'Close')}
              </button>
              <Button
                onClick={() => {
                  const s = detailedService;
                  setDetailedService(null);
                  handleBook(s);
                }}
              >
                {t('services.bookService', 'Book This Service')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceGrid;