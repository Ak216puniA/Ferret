import React, { useEffect } from "react";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import SeasonTestContent from "../components/season_test_content";
import SubHeader from "../components/subheader";

function SeasonDashboard() {
    const {season_id} = useParams()
    
    useEffect(() => {

    })

    return (
        <>
        <Header />
        <NavigationBar />
        <SubHeader page={`Home / Recruitment Season ${season_id}`} />
        <SeasonTestContent />
        </>
    )
}

export default SeasonDashboard