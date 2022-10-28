import React from "react";
import './index.css'
import { MdHomeFilled } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdHelpCenter } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function NavigationBar() {

    let navigate = useNavigate()
    const routeChange = (address) => {
        const url = `/${address}`
        console.log(url)
        navigate(url)
    }

    return(
        <div className="navigationBar">
            <div className="navigationIcon" onClick={() => routeChange('home')}><MdHomeFilled size={28}/></div>
            <div className="navigationIcon"><MdGroups size={44}/></div>
            <div className="navigationIcon"><IoMdSettings size={28}/></div>
            <div className="navigationIcon"><MdHelpCenter size={28}/></div>
        </div>
    )
    
}

export default NavigationBar