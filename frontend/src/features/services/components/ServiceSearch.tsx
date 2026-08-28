import React from "react";

interface ServiceSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

function ServiceSearch({ search, setSearch }: ServiceSearchProps) {
  return (
    <div className="w-full md:w-80">
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-pink-200 px-4 py-3 outline-none focus:border-pink-500"
      />
    </div>
  );
}

export default ServiceSearch;