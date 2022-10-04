import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import MyListpublic from "../MyListings/MyListpublic";
import Navbar from "../Navbar/Navbar";
import "./Home.css";

function Home() {

  return (
    <>
    <Navbar/>
    <div className=" custom-scrollbars__content">

       <MyListpublic/>
      </div>
    </>
  );
}

export default Home;
