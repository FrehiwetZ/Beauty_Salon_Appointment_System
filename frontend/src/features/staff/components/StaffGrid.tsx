import { useState } from "react";
import StaffCard from "./StaffCard";
import { useData } from "../../../context/DataContext";
import Button from "../../../components/Button";
import { api } from "../../../services/api";

function StaffGrid() {
  const { staffList } = useData();
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
      <div className="text-center py-10 text-gray-500">
        No staff members found.
      </div>
    );
  }

  // Calculate rating summary
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

      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              &times;
            </button>
            
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
              {(selectedStaff.staffProfile?.imageUrl || selectedStaff.imageUrl || selectedStaff.image) ? (
                <img
                  src={selectedStaff.staffProfile?.imageUrl || selectedStaff.imageUrl || selectedStaff.image}
                  alt={selectedStaff.user?.firstName || selectedStaff.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-2xl font-bold">
                  {(selectedStaff.user?.firstName || selectedStaff.firstName)?.[0]}
                  {(selectedStaff.user?.lastName || selectedStaff.lastName)?.[0]}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedStaff.user?.firstName || selectedStaff.firstName} {selectedStaff.user?.lastName || selectedStaff.lastName}
                </h2>
                <p className="text-pink-600 font-medium">
                  {selectedStaff.staffProfile?.position || selectedStaff.position || "Stylist"}
                </p>
              </div>
            </div>
            
            <div className="space-y-6 overflow-y-auto flex-grow pr-2">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-1">Biography</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedStaff.staffProfile?.bio || selectedStaff.bio || "No biography available."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-2">Rating & Reviews</h3>
                {loadingDetails ? (
                  <div className="text-sm text-gray-400 py-2 animate-pulse">Loading reviews...</div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mb-4 bg-pink-50/50 p-3 rounded-xl border border-pink-100/50">
                      <span className="text-3xl font-extrabold text-pink-700">{avgRating}</span>
                      <span className="text-yellow-400 text-lg">{"★".repeat(Math.round(Number(avgRating)))}{"☆".repeat(5 - Math.round(Number(avgRating)))}</span>
                      <span className="text-sm text-gray-500">({ratingCount} {ratingCount === 1 ? "review" : "reviews"})</span>
                    </div>

                    <div className="space-y-3">
                      {ratings.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-2">No reviews yet for this stylist.</p>
                      ) : (
                        ratings.map((rating: any) => (
                          <div key={rating.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-800">
                                {rating.user?.firstName || "Customer"} {rating.user?.lastName || ""}
                              </span>
                              <span className="text-yellow-400 text-xs">{"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)}</span>
                            </div>
                            {rating.comment ? (
                              <p className="text-sm text-gray-600 italic bg-gray-50 p-2.5 rounded-lg">
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
            
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4 flex-shrink-0">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffGrid;