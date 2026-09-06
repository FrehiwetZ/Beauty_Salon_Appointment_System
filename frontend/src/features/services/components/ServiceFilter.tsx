import { useLanguage } from "../../../context/LanguageContext";

interface ServiceFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

function ServiceFilter({
  selectedCategory,
  setSelectedCategory,
}: ServiceFilterProps) {
  const { t } = useLanguage();

  const categories = [
    { key: "All", labelKey: "category.all" },
    { key: "Hair", labelKey: "category.hair" },
    { key: "Makeup", labelKey: "category.makeup" },
    { key: "Face", labelKey: "category.face" },
    { key: "Nails", labelKey: "category.nails" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {categories.map(({ key, labelKey }) => (
        <button
          key={key}
          onClick={() => setSelectedCategory(key)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            selectedCategory === key
              ? "bg-pink-600 text-white border-pink-600 shadow-sm"
              : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50"
          }`}
        >
          {t(labelKey, key)}
        </button>
      ))}
    </div>
  );
}

export default ServiceFilter;