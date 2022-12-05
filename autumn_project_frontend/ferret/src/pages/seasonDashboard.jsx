import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import RoundContent from "../components/round_content";
import SubHeader from "../components/subheader";
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"
import { Navigate } from "react-router-dom";


function SeasonDashboard() {
    const {season_id} = useParams()
    const logoutState = useSelector((state) => state.logout.authenticated)
    const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const dispatch = useDispatch()

    const page = [
        ['Home','home'],
        [`Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type})`,`season/${season_id}`]
    ]

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
    },[dispatch])

    if(userAuthenticated && logoutState){
        return (
            <>
            <Header />
            <NavigationBar />
            <SubHeader page={page} />
            <RoundContent s_id={season_id} />
            </>
        )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default SeasonDashboard