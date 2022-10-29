import React from "react";
import SeasonTabDialog from "../season_tab_dialog";
import { openCreateRoundDialog } from "../../features/seasonTab/seasonTabSlice"
import { useDispatch } from "react-redux";
import './index.css';

function SeasonTestContent() {
    const dispatch = useDispatch()
    return (
        <div className="seasonTestContent">
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <SeasonTabDialog />
        </div>
    )
}

export default SeasonTestContent