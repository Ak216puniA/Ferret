import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/header/index";
import HomeContent from "../components/home_content/index";
import NavigationBar from "../components/navbar/index";
import SubHeader from "../components/subheader/index";
import { Navigate } from "react-router-dom";

function Home() {
  const logoutState = useSelector((state) => state.logout.authenticated)
  const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')

  const page = [
    ['Home','home']
  ]

  useEffect(() => {
    localStorage.setItem('page','home')
  },[])

  if(userAuthenticated && logoutState){
    return (
      <>
        <Header />
        <NavigationBar />
        <SubHeader page={page} initialTabs={['Developer','Designer']} />
        <HomeContent contentHeading='Recruitment Seasons'/>
      </>
    )
  }else{
    return <Navigate to="/login" replace={true} />
  }
  
}

export default Home