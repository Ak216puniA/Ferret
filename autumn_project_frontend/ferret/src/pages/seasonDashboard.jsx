import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import RoundContent from "../components/round_content";
import SubHeader from "../components/subheader";
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"
import { Navigate } from "react-router-dom";
import { SEASON_ROUNDS_WEBSOCKET } from "../urls";
import { updateCandidateList } from "../features/seasonRoundContent/seasonRoundContentSlice";

function SeasonDashboard() {
    const {season_id} = useParams()
    const logoutState = useSelector((state) => state.logout.authenticated)
    const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()
    const wsSeasonRounds = useRef('')

    if(wsSeasonRounds.current!==''){
        wsSeasonRounds.current.onopen = () => {
            console.log("websocket connection opened!")
        }
        wsSeasonRounds.current.onmessage = (event) => {
            const movedCandidatesData = JSON.parse(event.data)
            if (movedCandidatesData['round_id']===roundTabState.currentTabId) dispatch(updateCandidateList(movedCandidatesData))
        }
        wsSeasonRounds.current.onerror = (event) => {
            console.log("Error in websocket connection!")
            console.log(event.data)
        }
        wsSeasonRounds.current.onclose = () => {
            console.log("Websocket connection closed!")
        }
    }

    const page = [
        ['Home','home'],
        [`Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type})`,`season/${season_id}`]
    ]

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
        wsSeasonRounds.current = new WebSocket(`${SEASON_ROUNDS_WEBSOCKET}${season_id}/`)
    },[])

    if(userAuthenticated && logoutState){
        return (
            <>
            <Header />
            <NavigationBar ws={wsSeasonRounds} />
            <SubHeader page={page} />
            <RoundContent s_id={season_id} wsSeasonRounds={wsSeasonRounds}/>
            </>
        )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default SeasonDashboard