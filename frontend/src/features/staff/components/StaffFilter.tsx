import React from "react";

interface StaffFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  "All",
  "Hair",
  "Makeup",
  "Nails",
  "Face",
];

function StaffFilter({
  selectedCategory,
  setSelectedCategory,
}: StaffFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === category
              ? "bg-pink-600 text-white"
              : "bg-pink-50 text-pink-700"
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}

export default StaffFilter;