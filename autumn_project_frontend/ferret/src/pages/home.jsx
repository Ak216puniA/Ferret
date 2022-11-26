import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/header/index";
import HomepageContent from "../components/home_page_content/index";
import NavigationBar from "../components/navbar/index";
import SubHeader from "../components/subheader/index";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const logoutState = useSelector((state) => state.logout.authenticated)
  const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated');

  if(userAuthenticated && logoutState){
    return (
      <>
        <Header />
        <NavigationBar />
        <SubHeader page='Home' initialTabs={['Developer','Designer']} />
        <HomepageContent contentHeading='Recruitment Seasons'/>
      </>
    )
  }else{
    return <Navigate to="/login" replace={true} />
  }
  
}

export default Home