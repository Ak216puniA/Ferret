import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { listRounds } from "../../features/seasonTab/seasonTabSlice";
import "./index.css";

function SeasonTabs(props) {
    const seasonTabState = useSelector((state) => state.seasonTab)
    const dispatch = useDispatch()
    
    return (
        <div onClick={() => dispatch(listRounds())}>Click</div>
    )
}

export default SeasonTabs