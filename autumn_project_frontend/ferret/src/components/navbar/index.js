import React, {Component} from "react";
import './index.css'
import { MdHomeFilled } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdHelpCenter } from "react-icons/md";

class NavigationBar extends Component{
    render(){
        return(
            <div className="navigationBar">
                <div className="navigationIcon"><MdHomeFilled size={28}/></div>
                <div className="navigationIcon"><MdGroups size={44}/></div>
                <div className="navigationIcon"><IoMdSettings size={28}/></div>
                <div className="navigationIcon"><MdHelpCenter size={28}/></div>
            </div>
        )
    }
}

export default NavigationBar