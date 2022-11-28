import React from "react";
import './index.css'
import { MdHomeFilled } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdHelpCenter } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { resetSectionTabState } from "../../features/sectionTab/sectionTabSlice";
import { useDispatch } from "react-redux";
import { resetRoundTabState } from "../../features/roundTab/roundTabSlice";
import { resetSeasonRoundContentState } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { resetQuestionsState } from "../../features/question/questionSlice";

function NavigationBar() {
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const routeChange = (address) => {
        const url = `/${address}`
        navigate(url)
    }

    const homeClickHandler = () => {
        dispatch(resetRoundTabState())
        dispatch(resetSeasonRoundContentState())
        dispatch(resetQuestionsState())
        dispatch(resetSectionTabState())
        localStorage.setItem('questions','close')
        routeChange('home')
    }

    return(
        <div className="navigationBar">
            <div className="navigationIcon" ><MdHomeFilled className="icon"  size={28} onClick={() => homeClickHandler()}/></div>
            <div className="navigationIcon"><MdGroups className="icon" size={44}/></div>
            <div className="navigationIcon"><IoMdSettings className="icon" size={28}/></div>
            <div className="navigationIcon"><MdHelpCenter className="icon" size={28}/></div>
        </div>
    )
    
}

export default NavigationBar