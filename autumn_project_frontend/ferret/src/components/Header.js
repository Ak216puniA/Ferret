import React, {Component} from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsFillSquareFill } from "react-icons/bs"
import '../styles/Header.css';

class Header extends Component{
    render(){
        return(
            <div className="header">
                <div className="headerDiv1">
                    <div className="smallIcon"><BsFillSquareFill size={24} /></div>
                    <div className="appName">Ferret</div>
                </div>
                <div className="headerDiv2">
                    <div className="smallText">Logout</div>
                    <div className="smallIcon"><FaUserCircle size={24} /></div>
                </div>
            </div>
        )
    }
}

export default Header
