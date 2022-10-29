import React from "react";
import SeasonTabDialog from "../season_tab_dialog";
import { openCreateRoundDialog } from "../../features/seasonTab/seasonTabSlice"
import { useDispatch } from "react-redux";
import './index.css';

function SeasonTestContent(props) {
    const { s_id } = props
    const dispatch = useDispatch()
    return (
        <div className="seasonTestContent">
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <SeasonTabDialog season_id={s_id}/>
        </div>
    )
}

export default SeasonTestContent