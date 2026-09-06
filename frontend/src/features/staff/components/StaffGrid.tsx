import { useState } from "react";
import StaffCard from "./StaffCard";
import { useData } from "../../../context/DataContext";
import { useLanguage } from "../../../context/LanguageContext";
import Button from "../../../components/Button";
import { api } from "../../../services/api";

function StaffGrid() {
  const { staffList } = useData();
  const { t, localizeStaff } = useLanguage();
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [detailedStaff, setDetailedStaff] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSelectStaff = async (staff: any) => {
    setSelectedStaff(staff);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/staff/${staff.id}`);
      if (res.data.success) {
        setDetailedStaff(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load staff details", e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClose = () => {
    setSelectedStaff(null);
    setDetailedStaff(null);
  };

  if (staffList.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-8 text-gray-500">
        <div className="text-4xl mb-3">👥</div>
        <p className="font-medium text-gray-700">{t('staff.noStaffFound', 'No staff members currently available.')}</p>
      </div>
    );
  }

  // Calculate rating summary
  const currentStaff = detailedStaff || selectedStaff;
  const staffLoc = currentStaff ? localizeStaff(currentStaff) : null;
  const ratings = detailedStaff?.staffProfile?.ratings || [];
  const ratingCount = ratings.length;
  const avgRating = ratingCount > 0 
    ? (ratings.reduce((acc: number, r: any) => acc + r.score, 0) / ratingCount).toFixed(2)
    : "0.00";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {staffList.map((staff) => (
          <StaffCard key={staff.id} staff={staff} onSelect={() => handleSelectStaff(staff)} />
        ))}
      </div>

      {selectedStaff && staffLoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer p-1 leading-none"
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 flex-shrink-0 pr-6">
              {(selectedStaff.staffProfile?.imageUrl || selectedStaff.imageUrl || selectedStaff.image) ? (
                <img
                  src={selectedStaff.staffProfile?.imageUrl || selectedStaff.imageUrl || selectedStaff.image}
                  alt={selectedStaff.user?.firstName || selectedStaff.firstName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-pink-200 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xl sm:text-2xl font-bold flex-shrink-0">
                  {(selectedStaff.user?.firstName || selectedStaff.firstName)?.[0]}
                  {(selectedStaff.user?.lastName || selectedStaff.lastName)?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                  {selectedStaff.user?.firstName || selectedStaff.firstName} {selectedStaff.user?.lastName || selectedStaff.lastName}
                </h2>
                <p className="text-pink-600 font-medium text-xs sm:text-sm truncate">
                  {staffLoc.position}
                </p>
              </div>
            </div>
            {/* Deactivation Notice */}
            {(currentStaff?.isActive === false || currentStaff?.staffProfile?.isActive === false || currentStaff?.user?.isActive === false) && (
              <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <div className="flex items-center gap-2 font-semibold text-sm text-amber-800">
                  <span>⚠️</span>
                  <span>{t('staff.currentlyUnavailable', 'Currently Unavailable')}</span>
                </div>
                {(currentStaff?.staffProfile?.deactivationReason || currentStaff?.deactivationReason) && (
                  <p className="text-xs text-amber-700 mt-1 pl-6">
                    <span className="font-medium">{t('staff.reason', 'Reason:')}</span> {currentStaff?.staffProfile?.deactivationReason || currentStaff?.deactivationReason}
                  </p>
                )}
                {(currentStaff?.staffProfile?.deactivatedUntil || currentStaff?.deactivatedUntil) && (
                  <p className="text-xs text-amber-600 mt-0.5 pl-6">
                    <span className="font-medium">{t('staff.availableAfter', 'Expected to return:')}</span> {new Date(currentStaff?.staffProfile?.deactivatedUntil || currentStaff?.deactivatedUntil).toLocaleDateString()}
                  </p>
                )}
                <p className="text-[11px] text-amber-600/80 mt-1.5 pl-6 italic">
                  {t('staff.deactivatedBookingNotice', 'This staff member cannot be booked while unavailable.')}
                </p>
              </div>
            )}

            <div className="space-y-5 sm:space-y-6 overflow-y-auto flex-grow pr-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-1">
                  {t('staff.biography', 'Biography')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {staffLoc.bio}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2">
                  {t('staff.ratingReviews', 'Rating & Reviews')}
                </h3>
                {loadingDetails ? (
                  <div className="text-sm text-gray-400 py-2 animate-pulse">{t('common.loading', 'Loading reviews...')}</div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mb-4 bg-pink-50/50 p-3 rounded-xl border border-pink-100/50">
                      <span className="text-2xl sm:text-3xl font-extrabold text-pink-700">{avgRating}</span>
                      <span className="text-yellow-400 text-base sm:text-lg">{"★".repeat(Math.round(Number(avgRating)))}{"☆".repeat(5 - Math.round(Number(avgRating)))}</span>
                      <span className="text-xs sm:text-sm text-gray-500">({ratingCount} {ratingCount === 1 ? t('staff.review', 'review') : t('staff.reviews', 'reviews')})</span>
                    </div>

                    <div className="space-y-3">
                      {ratings.length === 0 ? (
                        <p className="text-xs sm:text-sm text-gray-400 italic py-2">
                          {t('staff.noReviewsYet', 'No reviews yet for this stylist.')}
                        </p>
                      ) : (
                        ratings.map((rating: any) => (
                          <div key={rating.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                {rating.user?.firstName || "Customer"} {rating.user?.lastName || ""}
                              </span>
                              <span className="text-yellow-400 text-xs">{"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)}</span>
                            </div>
                            {rating.comment ? (
                              <p className="text-xs sm:text-sm text-gray-600 italic bg-gray-50 p-2.5 rounded-lg">
                                "{rating.comment}"
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No comment left.</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end border-t border-gray-100 pt-3 sm:pt-4 flex-shrink-0">
              <Button onClick={handleClose} className="w-full sm:w-auto">{t('common.close', 'Close')}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffGrid;