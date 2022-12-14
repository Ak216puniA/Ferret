import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import NavigationBar from "../components/navbar";
import SubHeader from "../components/subheader";
import { fetchCurrentSeason } from "../features/seasonSubHeader/seasonSubHeaderSlice"
import { fetchSections } from "../features/roundTab/roundTabSlice";
import { Navigate } from "react-router-dom";
import { fetchRound } from "../features/round/roundSlice";
import QuestionsContent from "../components/questions";

function Questions(){
    const {season_id,round_id} = useParams()
    const logoutState = useSelector((state) => state.logout.authenticated)
    const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const roundState = useSelector((state) => state.round.round)
    const dispatch = useDispatch()

    const page = [
        ['Home','home'],
        [`Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type})`,`season/${season_id}`],
        [`${roundState['name']}`,`season/${season_id}`],
        ['Questions',`season/${season_id}/${roundState['id']}/questions`]
    ]

    useEffect(() => {
        localStorage.setItem('questions','open')
        dispatch(fetchCurrentSeason(season_id))
        dispatch(fetchRound(round_id))
        dispatch(fetchSections(round_id))
        localStorage.setItem('page','questions')
    },[])

    if(userAuthenticated && logoutState){
        return (
            <>
            <Header />
            <NavigationBar />
            <SubHeader page={page} />
            <QuestionsContent />
            </>
        )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default Questions