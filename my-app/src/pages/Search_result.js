import axios from "axios";
import React, { useEffect, useState } from "react";
import UserAPI from "../api/user-api";
import { useNavigate } from "react-router-dom";
import { UserRoles } from "../api/structures";
const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const navigator = useNavigate();

  useEffect(() => {
    const test = async () => {
      await UserAPI.testForidden(UserRoles.USER, () => navigator('/forbidden'));
    }
    test();
  })
  const handleSearch = async () => {
    const apiUrl = `http://localhost:8000/api/search/?q=${encodeURIComponent(searchTerm)}`;
    axios.get(apiUrl)
      .then(response => {
        console.log(response.data);
        setResults(response.data.results);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.username} - {result.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
