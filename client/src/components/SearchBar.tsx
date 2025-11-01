import React, { useState } from "react";
import useStore from "../store/useStore";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const searchCourses = useStore((s) => s.searchCourses);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchCourses(query);
  };

  return (
    <form onSubmit={handleSubmit} className="my-2">
      <input
        className="border p-2 mr-2"
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="bg-green-600 text-white px-3 py-2 rounded" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
