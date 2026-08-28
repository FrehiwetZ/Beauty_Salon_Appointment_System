import React, { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceSearch from "./ServiceSearch";
import ServiceFilter from "./ServiceFilter";
import { Service } from "../types/service";
import { useNavigation } from "../../../context/NavigationContext";
import { useData } from "../../../context/DataContext";

function ServiceGrid() {
  const { services } = useData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const { setSelectedServiceId, setPage } = useNavigation();

  const handleBook = (service: Service) => {
    setSelectedServiceId(service.id);
    setPage('appointments');
  };

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
        <div className="text-center py-10 text-gray-500">
          No services found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={handleBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceGrid;