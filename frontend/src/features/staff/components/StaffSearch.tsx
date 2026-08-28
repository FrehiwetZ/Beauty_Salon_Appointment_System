import React from "react";

interface StaffSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

function StaffSearch({ search, setSearch }: StaffSearchProps) {
  return (
    <div className="mb-5">

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search staff..."
        className="w-full rounded-lg border border-pink-200 px-4 py-3 outline-none focus:border-pink-500"
      />

    </div>
  );
}

export default StaffSearch;