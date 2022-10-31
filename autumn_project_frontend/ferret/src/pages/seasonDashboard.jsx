import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import SeasonTestContent from "../components/season_test_content";
import SubHeader from "../components/subheader";
import Questions from "../components/questions"
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"
import { Navigate } from "react-router-dom";


function SeasonDashboard() {
    const {season_id} = useParams()
    const authState = useSelector((state) => state.logout.authenticated)
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const seasonTabState = useSelector((state) => state.seasonTab)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
    },[])

    const seasonDashboardContent = seasonSubHeaderState.open_questions ? <Questions /> : <SeasonTestContent s_id={season_id}/>
    const round = seasonSubHeaderState.open_questions ? `/ ${seasonTabState.currentTab}` : ''

    if(authState){
        return (
            <>
            <Header />
            <NavigationBar />
            <SubHeader page={`Home / Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type}) ${round}`} />
            {seasonDashboardContent}
            </>
        )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default SeasonDashboard