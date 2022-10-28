import React from "react";
import './index.css'
import { MdHomeFilled } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdHelpCenter } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { seasonClicked } from "../../features/seasonTab/seasonTabSlice"

function NavigationBar() {
    // const dispatch = useDispatch()
    let navigate = useNavigate()

    const routeChange = (address) => {
        const url = `/${address}`
        navigate(url)
    }

    // const homeClickHandler = () => {
    //     dispatch(seasonClicked(-1))
    //     routeChange('home')
    // }

    return(
        <div className="navigationBar">
            <div className="navigationIcon" ><MdHomeFilled className="icon"  size={28} onClick={() => routeChange('home')}/></div>
            <div className="navigationIcon"><MdGroups className="icon" size={44}/></div>
            <div className="navigationIcon"><IoMdSettings className="icon" size={28}/></div>
            <div className="navigationIcon"><MdHelpCenter className="icon" size={28}/></div>
        </div>
    )
    
}

export default NavigationBar