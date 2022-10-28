import React, { useEffect } from "react";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
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
        </>
    )
}

export default SeasonDashboard