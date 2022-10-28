import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { listRounds } from "../../features/seasonTab/seasonTabSlice";
import "./index.css";

function SeasonTabs(props) {
    const seasonTabState = useSelector((state) => state.seasonTab)
    const dispatch = useDispatch()

    dispatch(listRounds())
    
    return <>hello</>
}

export default SeasonTabs