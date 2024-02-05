import React, { useEffect, useState } from 'react';
import ArticleAPI from '../api/article_api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAPI from '../api/user-api';
import { UserRoles } from '../api/structures';
import { useNavigate } from 'react-router-dom';
const ArticleUploader = () => {
  const navigator = useNavigate('/forbidden')
  const [url, setUrl] = useState('');
  const notify = () => toast.error();
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  const handleUpload = async () =>{
    try {
      await ArticleAPI.handleUpload(url);
      notify();
      toast.error(">--UPLOAD SUCCESS!");
    } catch (error) {
      notify();
      toast.error(">--ERROR HAPPENED  : " + error);
    }

  }
  useEffect(() => {
    const test = async () => {
      await UserAPI.testForidden(UserRoles.ADMIN,() => navigator('/forbidden'));
    }
    test();
 
  },)

  return (
    <div>
      <ToastContainer theme='dark' position="bottom-center" ></ToastContainer>
      <label>URL du PDF:</label>
      <input type="text" value={url} onChange={handleUrlChange} />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
};

export default ArticleUploader;
