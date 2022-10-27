import React from "react";
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";
import Header from "../components/header/index";
import HomepageContent from "../components/home_page_content/index";
import NavigationBar from "../components/navbar/index";
import SubHeader from "../components/subheader/index";

function Home() {
    const authState = useSelector((state) => state.logout.authenticated)
    if(authState){
      return (
        <>
          <Header />
          <NavigationBar />
          <SubHeader page='Home' initialTabs={['Developer','Designer']} firstTab='Developer'/>
          <HomepageContent contentHeading='Recruitment Seasons'/>
        </>
      )
    }else{
      return <Navigate to="/login" replace={true} />
    }
}

export default Home