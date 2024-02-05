import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import ModeratorList from "./Components/modList.js";
import Search_result from "./pages/Search_result.js";
import Login_page from "./pages/Login_page";
import Register_page from "./pages/Register_page";
import { BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";
import "./index.css";
import ModPage from "./pages/mod_start_page.js";
import ModEditPage from "./pages/mod_edit_page.js";
import YourForm from "./pages/Editor.js";
import ModeratorForm from "./Components/InserModerateur.js";
import ModalEditJSON from "./Components/model_edit_json.js";
import Moderators from './pages/moderators.js'
import Landing from './pages/Landing.js'
import SearchResult from "./pages/SearchResult.js";
import SearchResults from "./pages/Search_result.js";
import Seemore from "./pages/See_more.js";
import Reg_land from "./pages/Reg_land.js";
import Log_land from "./pages/Log_land.js";
import Accueil from "./pages/Home";
import Forbidden from "./pages/forbbidden.js";
import ProfileAdmin from "./pages/ProfileAdmin.js";
import ArticleUploader from "./pages/UploadArticle.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/ProfileAdmin" element={<ProfileAdmin />}></Route>

        <Route path="/User" element={<Favorites />}></Route>
        <Route path="/see-more/:articleId" element={<Seemore></Seemore>} />
        <Route path="/2" element={<SearchResult />}></Route>
        <Route path="/3" element={<SearchResults />}></Route>
        <Route path="/4" element={<Register_page />}></Route>
        <Route path="/5" element={<Reg_land />}></Route>
        <Route path="/7" element={<cleanUpData />}></Route>
        <Route path="/8" element={< ModEditPage />}></Route>
        <Route path="/9" element={< Log_land />}></Route>


        { }
        <Route path="/Admin" element={<Moderators />}></Route>
        <Route path="/forbidden" element={< Forbidden />}></Route>
        <Route path="/Moderateur" element={<ModeratorForm />}></Route>
        <Route path="/edit-article/:articleId" element={<ModEditPage></ModEditPage>} />
        <Route path="/edit-article-form/:articleId" element={<ModalEditJSON />} />
        <Route path="/" element={<Landing />}></Route>
        <Route path="/Upload" element={<ArticleUploader />}></Route>

        <Route path="/Settings" element={<Settings />}></Route>
        <Route path="/Favorites" element={<Favorites />}></Route>
        <Route path="/Login" element={<Login_page />}></Route>
        <Route path="/Register" element={<Register_page />}></Route>
        <Route path="/Search_result" element={<SearchResult />}></Route>
        <Route path="/ModPage" element={<ModPage />}></Route>
        <Route path="/Home" element={<Accueil />}></Route>
      </Routes>
    </Router>


  );
}

export default App;