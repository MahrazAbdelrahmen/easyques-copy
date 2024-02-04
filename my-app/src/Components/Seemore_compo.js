import React from "react";
import { useState, useEffect } from "react";
import ArticleAPI from "../api/article_api";


const Seemore_compo = ({ articleData, pdfId }) => {
  const { pub_date, title, authors, institutions, abstract } = articleData.meta_data;
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = 'go.com'
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await ArticleAPI.fetchPdfData(pdfId);
        setPdfData(data);
        setLoading(false);
      } catch (error) {



      }
    }
    getData();
  }, [pdfId]);

  return (

    <div className="p-10 grid gap-6">
      <time className="font-Montserrat">{pub_date}</time>
      <div className=" flex items-start justify-between ">
        <div className="seemore-row flex justify-between items-start">
          <p className=" hyphens-auto   w-[50%] font-Montserrat text-green font-bold text-2xl ">
            {title}
          </p>
          <div className="seemore-right md:flex grid gap-5">
            <button className="flex gap-2 border-2 border-blue  rounded-xl px-6 py-2 justify-center items-center">
              <img src="./Assets/empty-heart.png" className="h-6" alt="" />
              <p className="text-md text-blue">Add to favorite</p>
            </button>
          </div>
        </div>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex debitis
          modi quae laboriosam sapiente optio animi accusantium aspernatur
          quasi hic nisi consequuntur nesciunt temporibus, ipsum fugiat
          tempora quaerat? Magni, nihil! Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Alias accusantium sunt labore vel sed
          omnis facere, facilis suscipit, atque obcaecati numquam aut neque
          nobis harum ipsa voluptatem? Hic, distinctio molestias!'' Lorem
          ipsum dolor sit amet consectetur, adipisicing elit. Doloribus
          maiores quibusdam, eum consequuntur velit aut hic explicabo ipsum
          magni laudantium enim nulla molestias voluptates asperiores? Id sit
          atque magni obcaecati? Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Possimus totam ab ducimus. Eveniet quisquam, culpa
          vero quas maxime, nobis velit itaque beatae dolore explicabo tenetur
          ipsum officia, amet dignissimos provident! Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Accusamus cumque, quas tempora
          nobis natus minus, ab nemo officia beatae necessitatibus dolorum.
          Cupiditate ipsa odit odio similique nostrum! Dolores, mollitia
          cumque. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Maxime temporibus dolores porro id magnam voluptas facilis, possimus
          assumenda eaque ipsa delectus soluta quod reiciendis rerum ut amet,
          obcaecati minima? Harum.</p>
        <div className=" font-Montserrat font-bold text-xl ">
          {authors.map((author, index) => (
            <div key={index}>
              <a href="#" className="underline decoration-sky-500 font-Montserrat">
                {author.name} {/* Assuming 'name' is the property you want to render */}
              </a>
              {index < authors.length - 1 && " | "}
            </div>
          ))}
        </div>
        <div className="font-Montserrat font-bold text-xl">
          {/* Institutions */}
          {institutions.map((institution, index) => (
            <div className="font-Montserrat underline decoration-green" key={index}>
              {institution.name} {/* Assuming 'name' is the property you want to render */}
            </div>
          ))}
        </div>
      </div>
      <div className="hyphens-auto mt-5 ml-5 font-Montserrat font-bold text-xl">
        URL :
        <a
          href={url}
          className="mt-5 ml-5 font-Montserrat font-bold italic text-xl text-green underline decoration-lightStartD"
        >
          {url}
        </a>
      </div>
      <div className=" w-128 h-128 b-2 overflow-y-hidden bg-lightStartD rounded">
        {loading ? (
          <div>Loading...</div>
        ) : (
          pdfData &&
          <iframe
            src={pdfData}
            width='100%'
            height="100%"
          ></iframe>
        )}

      </div>
    </div>

  );
};
export default Seemore_compo;
