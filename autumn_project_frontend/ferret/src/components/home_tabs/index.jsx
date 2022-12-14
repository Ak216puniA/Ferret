import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import "./index.css";
import {tabClicked} from "../../features/homeTab/homeTabSlice"
import {listSeasons} from "../../features/season/seasonSlice"
import { fetchSections, listRounds } from "../../features/roundTab/roundTabSlice";
import { fetchRoundCandidates } from "../../features/seasonRoundContent/seasonRoundContentSlice";

function HomeTabs(props) {
    const { homeTabs } = props
    const season_types = homeTabs

    const homeTabState = useSelector((state) => state.homeTab.currentTab)
    const dispatch = useDispatch()

    useEffect(() => {
        if(homeTabState===''){
            document.getElementById(`${season_types[0]}Arrow`).style.display = 'block'
            dispatch(listSeasons(season_types[0]))
        }else{
            season_types.forEach(tab => {
                document.getElementById(`${tab}Arrow`).style.display = (tab===homeTabState) ? 'block' : 'none'
            });
            dispatch(listSeasons(homeTabState))
        }
    },[homeTabState])

    let tabs = season_types.map(tab => {
        return(
            <div className="pageTabDiv" key={tab}>
                <button className={"pageTab pageTabArrowDiv"} onClick={() => dispatch(tabClicked(tab))}>{tab}</button>
                <div className={"currentTabDownArrowDiv pageTabArrowDiv"}><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
            </div>
        )
    })

    return <>{tabs}</>
}

export default HomeTabs