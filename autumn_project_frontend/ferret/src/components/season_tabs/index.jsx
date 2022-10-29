import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
// import { useParams } from "react-router-dom";
import { tabClicked } from "../../features/seasonTab/seasonTabSlice";
import { MdAddBox } from "react-icons/md"
import { openCreateRoundDialog } from "../../features/seasonTab/seasonTabSlice";
import "./index.css";

function SeasonTabs(props) {
    const seasonTabState = useSelector((state) => state.seasonTab)
    const roundList = seasonTabState.round_list
    // const {season_id} = useParams()
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(roundList.length>0){
            if(seasonTabState.currentTab===''){
                document.getElementById(`${roundList[0]}Arrow`).style.display = 'block'
            }else{
                roundList.forEach(tab => {
                    document.getElementById(`${tab}Arrow`).style.display = (tab===seasonTabState.currentTab) ? 'block' : 'none'
                });
            }
        } 
    })

    let tabs = seasonTabState.round_list.length>0 ? roundList.map(tab => {
        return(
            <div className="pageTabDiv" key={tab}>
                <button className="pageTab" onClick={() => dispatch(tabClicked(tab))}>{tab}</button>
                <div className="currentTabDownArrowDiv"><div className="currentTabDownArrow" id={`${tab}Arrow`}></div></div>
            </div>
        )
    }) : []

    return (
        <>
            {tabs}
            <div><MdAddBox className="addIcon" onClick={() => dispatch(openCreateRoundDialog())} size={28}/></div>
        </>
    )
}

export default SeasonTabs