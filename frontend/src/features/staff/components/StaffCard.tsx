import React from "react";
import { Staff } from "../types/staff";
import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";

interface StaffCardProps {
  staff: any;
  onSelect: (staff: any) => void;
}

function StaffCard({ staff, onSelect }: StaffCardProps) {
  const staffImg = staff.staffProfile?.imageUrl || staff.imageUrl || staff.image;
  const firstName = staff.user?.firstName || staff.firstName || '';
  const lastName = staff.user?.lastName || staff.lastName || '';

  return (
    <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      <div className="h-52 bg-pink-50 flex items-center justify-center overflow-hidden">
        {staffImg ? (
          <img
            src={staffImg}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-pink-300 font-bold text-4xl">
            {firstName?.[0]}{lastName?.[0]}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">

        <div className="flex items-center gap-3">
          <Avatar name={`${staff.user?.firstName || ''} ${staff.user?.lastName || ''}`} />

          <div>
            <h3 className="font-semibold text-gray-800">
              {staff.user?.firstName} {staff.user?.lastName}
            </h3>

            <p className="text-sm text-pink-600">
              {staff.staffProfile?.position || "Specialist"}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 flex-grow">
          <p className="line-clamp-2">
            <span className="font-medium">Bio:</span>{" "}
            {staff.staffProfile?.bio || "No biography provided."}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Rating:</span>{" "}
            {staff.averageRating ? (
              <span className="inline-flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-gray-800">{staff.averageRating.toFixed(1)}</span>
                <span className="text-gray-400">({staff.staffProfile?.ratings?.length || 0} {staff.staffProfile?.ratings?.length === 1 ? 'review' : 'reviews'})</span>
              </span>
            ) : (
              <span className="text-gray-400 italic">New (No reviews)</span>
            )}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full mt-5"
          onClick={() => onSelect(staff)}
        >
          View Profile
        </Button>

      </div>
    </div>
  );
}

export default StaffCard;