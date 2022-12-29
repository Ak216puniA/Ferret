import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/header'
import InterviewPanelsContent from '../components/interview_panels_content'
import NavigationBar from '../components/navbar'
import SubHeader from '../components/subheader'
import { fetchInterviewPanels, updatePanelStatus } from '../features/interviewPanel/interviewPanelSlice'
import { listRounds } from '../features/roundTab/roundTabSlice'
import { fetchCurrentSeason } from '../features/seasonSubHeader/seasonSubHeaderSlice'
import { INTERVIEW_PANELS_WEBSOCKET } from '../urls'

function InterviewPanel() {
    const {season_id} = useParams()
    const logoutState = useSelector((state) => state.logout.authenticated)
    const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const dispatch = useDispatch()
    const wsInterviewPanels = useRef('')

    if(wsInterviewPanels.current!==''){
        wsInterviewPanels.current.onopen = () => {
            console.log("websocket connection opened!")
        }
        wsInterviewPanels.current.onmessage = (event) => {
            const panelData = JSON.parse(event.data)
            dispatch(updatePanelStatus(panelData))
        }
        wsInterviewPanels.current.onerror = (event) => {
            console.log("Error in websocket connection!")
            console.log(event.data)
        }
        wsInterviewPanels.current.onclose = () => {
            console.log("Websocket connection closed!")
        }
    }

    const page = season_id>0 ? 
    [
        ['Home','home'],
        [`Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type})`,`season/${season_id}`],
        ['Interview Panel',`season/${season_id}/interview_panels`]
    ] :
    [
        ['Home','home'],
        ['Interview Panel',`season/0/interview_panels`]
    ]

    useEffect(() => {
        wsInterviewPanels.current = new WebSocket(`${INTERVIEW_PANELS_WEBSOCKET}${season_id}/`)
        if(season_id>0) dispatch(fetchCurrentSeason(season_id))
        dispatch(fetchInterviewPanels(season_id))
        dispatch(listRounds(season_id))
        localStorage.setItem('page','interviewPanel')
    },[])

    if(userAuthenticated && logoutState){
        return (
            <>
            <Header />
            <NavigationBar ws={wsInterviewPanels}/>
            <SubHeader page={page} noTabs={true} />
            <InterviewPanelsContent seasonId={season_id} wsInterviewPanels={wsInterviewPanels}/>
            </>
    )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default InterviewPanel