import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { tabClicked } from "../../features/seasonTab/seasonTabSlice";
import { MdAddBox } from "react-icons/md"
import { openCreateRoundDialog, fetchSections } from "../../features/seasonTab/seasonTabSlice";
import { fetchRoundCandidates } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { closeQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice"
import "./index.css";

function SeasonTabs(props) {
    const seasonTabState = useSelector((state) => state.seasonTab)
    const roundList = seasonTabState.round_list
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(roundList.length>0){
            if(seasonTabState.currentTab===''){
                document.getElementById(`${roundList[0]['name']}Arrow`).style.display = 'block'
                dispatch(
                    tabClicked({
                        tab_name: roundList[0]['name'],
                        tab_id: roundList[0]['id']
                    })
                )
                dispatch(fetchRoundCandidates(roundList[0]['id']))
                dispatch(fetchSections(roundList[0]['id']))
            }else{
                roundList.forEach(tab => {
                    document.getElementById(`${tab['name']}Arrow`).style.display = (tab['name']===seasonTabState.currentTab) ? 'block' : 'none'
                });
            }
        } 
    })

    const tabClickHandler = (tab_data) => {
        dispatch(
            tabClicked({
                tab_name: tab_data['tab_name'],
                tab_id: tab_data['tab_id']
            })
        )
        dispatch(fetchRoundCandidates(tab_data['tab_id']))
        dispatch(fetchSections(tab_data['tab_id']))
        dispatch(closeQuestions())
    }

    let tabs = seasonTabState.round_list.length>0 ? roundList.map(tab => {
        return(
            <div className="pageTabDiv" key={tab['id']}>
                <button className={"pageTab pageTabArrowDiv"} onClick={() => tabClickHandler({tab_name: tab['name'],tab_id: tab['id']})}>{tab['name']}</button>
                <div className={"currentTabDownArrowDiv pageTabArrowDiv"}><div className="currentTabDownArrow" id={`${tab['name']}Arrow`}></div></div>
            </div>
        )
    }) : []

    return (
        <>
            {tabs}
            <div className="addRoundDiv"><MdAddBox className="addIcon" onClick={() => dispatch(openCreateRoundDialog())} size={28}/></div>
        </>
    )
}

export default SeasonTabs