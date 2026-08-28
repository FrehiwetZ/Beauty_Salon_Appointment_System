import React, { useState } from "react";
import StaffCard from "./StaffCard";
import { useData } from "../../../context/DataContext";
import Button from "../../../components/Button";

function StaffGrid() {
  const { staffList } = useData();
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  if (staffList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No staff members found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {staffList.map((staff) => (
          <StaffCard key={staff.id} staff={staff} onSelect={() => setSelectedStaff(staff)} />
        ))}
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setSelectedStaff(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-2xl font-bold">
                {selectedStaff.user?.firstName?.[0]}{selectedStaff.user?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedStaff.user?.firstName} {selectedStaff.user?.lastName}
                </h2>
                <p className="text-pink-600 font-medium">
                  {selectedStaff.staffProfile?.position || "Staff Member"}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Biography</h3>
                <p className="text-gray-600 mt-1">{selectedStaff.staffProfile?.bio || "No biography available."}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Average Rating</h3>
                <p className="text-gray-600 mt-1">
                  {selectedStaff.averageRating ? `${selectedStaff.averageRating.toFixed(1)} / 5.0` : 'No ratings yet'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setSelectedStaff(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffGrid;