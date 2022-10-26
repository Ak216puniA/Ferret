import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsFillSquareFill } from "react-icons/bs"
import './index.css';
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../features/logout/logoutSlice"

function Header() {
        const authState = useSelector((state) => state.logout.authenticated)
        const dispatch = useDispatch()
        return(
            <div className="header">
                <div className="headerDiv1">
                    <div className="smallIcon"><BsFillSquareFill size={24} color='#BABABA'/></div>
                    <div className="appName">Ferret</div>
                </div>
                <div className="headerDiv2">
                    <div className="smallText">
                        {/* Logout */}
                        <button className="logoutButton" onClick={() => dispatch(logoutUser())}>Logout</button>
                    </div>
                    <div className="smallIcon"><FaUserCircle size={24} /></div>
                </div>
            </div>
        )
}

export default Header