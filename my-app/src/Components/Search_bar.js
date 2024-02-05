import React, { useState } from "react";
import "../Styles/Search_bar.css";
import SearchResult from "../pages/SearchResult";
import { useNavigate } from 'react-router-dom';

const Search_bar = ({ backgroundColor }) => {
  const [query, setQuery] = useState("");
  const keywords = "";
  const authors = "";
  const institutions = "";
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/Search_result`);
  };

  return (
    <div className="bar-search">
      <button onClick={handleSearch}>
        {" "}
        <img
          src="./Assets/search.png"
          alt="Recherche"
          className="search-icon"
        />
      </button>

      <input
        id="query_r"
        type="search"
        placeholder="Rechercher des articles scientifiques ..."
        style={{ backgroundColor: backgroundColor }}
        className="border-2 placeholder:text-[15.4px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
    </div>
  );
};

export default Search_bar;