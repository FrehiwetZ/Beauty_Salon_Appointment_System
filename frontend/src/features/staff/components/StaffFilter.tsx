import { useLanguage } from "../../../context/LanguageContext";

interface StaffFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

function StaffFilter({
  selectedCategory,
  setSelectedCategory,
}: StaffFilterProps) {
  const { t } = useLanguage();

  const categories = [
    { key: "All", labelKey: "category.all" },
    { key: "Hair", labelKey: "category.hair" },
    { key: "Makeup", labelKey: "category.makeup" },
    { key: "Nails", labelKey: "category.nails" },
    { key: "Face", labelKey: "category.face" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(({ key, labelKey }) => (
        <button
          key={key}
          onClick={() => setSelectedCategory(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === key
              ? "bg-pink-600 text-white shadow-sm"
              : "bg-pink-50 text-pink-700 hover:bg-pink-100"
          }`}
        >
          {t(labelKey, key)}
        </button>
      ))}
    </div>
  );
}

export default StaffFilter;