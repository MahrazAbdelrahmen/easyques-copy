import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Article from "../Components/Article";
import UserAPI from "../api/user-api";
import { UserRoles } from "../api/structures";
import { useNavigate } from "react-router-dom";
import ArticleAPI from "../api/article_api";
function Favorites() {
  const navigator = useNavigate();
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const test = async () => {
      await UserAPI.testForidden(UserRoles.USER, () => navigator('/forbidden'));
    }
    const getData = async() =>{
      try {
        const data = await ArticleAPI.getFavoriteArticles();
        setFavoriteArticles(data);
        setLoading(false);
      } catch (error) {
        
      }
    }
    test();
    getData();
    
  }, []);

  console.log(favoriteArticles);

  return (
    <div className="SearchResult_Page grid content-center gap-10 justify-items-center">
      <Navbar />
      {favoriteArticles.map((article, index) => (
        <Article key={index} articleData={article} />
      ))}
    </div>
  );
}

export default Favorites;