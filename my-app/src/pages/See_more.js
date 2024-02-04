import React from "react";
import Navbar from "../Components/Navbar";
import Seemore_compo from "../Components/Seemore_compo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleAPI from "../api/article_api";

function Seemore() {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const id_key = useParams();
  const articleID = parseInt(id_key["articleId"], 10);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const data = await ArticleAPI.fetchArticle(articleID);
        setData(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article data:', error);
      }
    };

    fetchArticleData();
  }, [articleID]);

  return (
    <div>
      <Navbar></Navbar>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data &&
        <Seemore_compo articleData={data} pdfId={articleID}></Seemore_compo>
      )}

    </div>
  );
}
export default Seemore;
