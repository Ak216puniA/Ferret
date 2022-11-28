import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import RoundContent from "../components/round_content";
import SubHeader from "../components/subheader";
import Questions from "../components/questions"
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"
import { Navigate } from "react-router-dom";


function SeasonDashboard() {
    const {season_id} = useParams()
    const authState = useSelector((state) => state.logout.authenticated)
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
    },[])

    const seasonDashboardContent = localStorage.getItem('openQuestions')=='true' ? <Questions /> : <RoundContent s_id={season_id}/>
    const round = localStorage.getItem('openQuestions')=='true' ? `/ ${roundTabState.currentTab}` : ''

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