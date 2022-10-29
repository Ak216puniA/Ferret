import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import SeasonTestContent from "../components/season_test_content";
import SubHeader from "../components/subheader";
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"

function SeasonDashboard() {
    const {season_id} = useParams()
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
    },[])

    return (
        <>
        <Header />
        <NavigationBar />
        <SubHeader page={`Home / Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type})`} />
        <SeasonTestContent s_id={season_id}/>
        </>
    )
}

export default SeasonDashboard