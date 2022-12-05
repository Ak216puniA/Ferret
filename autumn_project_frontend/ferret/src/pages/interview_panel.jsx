import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/header'
import NavigationBar from '../components/navbar'
import PanelPageContent from '../components/panels_page_content'
import SubHeader from '../components/subheader'
import { fetchCurrentSeason } from '../features/seasonSubHeader/seasonSubHeaderSlice'

function InterviewPanel() {
    const {season_id} = useParams()
    const logoutState = useSelector((state) => state.logout.authenticated)
    const userAuthenticated= localStorage.getItem('authenticated')==null ? false : localStorage.getItem('authenticated')
    const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentSeason(season_id))
    },[dispatch])

    if(userAuthenticated && logoutState){
        return (
            <>
            <Header />
            <NavigationBar />
            <SubHeader page={`Home / Recruitment Season ${seasonSubHeaderState.current_season_year} (${seasonSubHeaderState.current_season_type}) / Interview Panels`} noTabs={true}/>
            <PanelPageContent />
            </>
    )
    }else{
        return <Navigate to="/login" replace={true} />
    }
}

export default InterviewPanel