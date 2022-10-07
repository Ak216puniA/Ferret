import React, {Component} from "react";
import '../styles/NavigationBar.css'
import { MdHomeFilled } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdHelpCenter } from "react-icons/md";

class NavigationBar extends Component{
    render(){
        return(
            <div className="navigationBar">
                <div className="navigationIcon"><MdHomeFilled size={32}/></div>
                <div className="navigationIcon"><MdGroups size={48}/></div>
                <div className="navigationIcon"><IoMdSettings size={32}/></div>
                <div className="navigationIcon"><MdHelpCenter size={32}/></div>
            </div>
        )
    }
}

export default NavigationBar