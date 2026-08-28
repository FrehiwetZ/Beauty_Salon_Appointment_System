import React from "react";

interface ServiceFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

function ServiceFilter({
  selectedCategory,
  setSelectedCategory,
}: ServiceFilterProps) {

  const categories = [
    "All",
    "Hair",
    "Makeup",
    "Face",
    "Nails",
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            selectedCategory === category
              ? "bg-pink-600 text-white border-pink-600"
              : "bg-white text-gray-700 border-pink-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default ServiceFilter;