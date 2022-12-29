import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsFillSquareFill } from "react-icons/bs"
import './index.css';
import { useDispatch } from "react-redux"
import { logoutUser } from "../../features/logout/logoutSlice"
import { fetchUsers } from "../../features/user/userSlice"

function Header() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUsers(3))
    },[])

    return(
        <div className="header">
            <div className="headerDiv1">
                <div className="smallIcon"><BsFillSquareFill size={24} color='#BABABA'/></div>
                <div className="appName">Ferret</div>
            </div>
            <div className="headerDiv2">
                <div className="smallText">
                    <button className="logoutButton" onClick={() => dispatch(logoutUser())}>Logout</button>
                </div>
                <div className="smallIcon"><FaUserCircle size={24} /></div>
            </div>
        </div>
    )
}

export default Header
