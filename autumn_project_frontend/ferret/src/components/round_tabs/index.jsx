import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { tabClicked, openCreateRoundDialog, fetchSections, fetchCandidateMarks } from "../../features/roundTab/roundTabSlice";
import { MdAddBox } from "react-icons/md"
import { fetchRoundCandidates } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import "./index.css";
import { closeQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice";

function RoundTabs() {
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(roundTabState.round_list.length>0){
            if(roundTabState.currentTab===''){
                document.getElementById(`${roundTabState.round_list[0]['name']}Arrow`).style.display = 'block'
                dispatch(
                    tabClicked({
                        tab_name: roundTabState.round_list[0]['name'],
                        tab_id: roundTabState.round_list[0]['id']
                    })
                )
                dispatch(fetchRoundCandidates(roundTabState.round_list[0]['id']))
                dispatch(fetchSections(roundTabState.round_list[0]['id']))
            }else{
                roundTabState.round_list.forEach(tab => {
                    document.getElementById(`${tab['name']}Arrow`).style.display = (tab['name']===roundTabState.currentTab) ? 'block' : 'none'
                });
            }
        }
    })

    const tabClickHandler = (tab_data) => {
        dispatch(
            tabClicked({
                tab_name: tab_data['tab_name'],
                tab_id: tab_data['tab_id'],
                // tab_type: tab_data['tab_type']
            })
        )
        // dispatch(closeQuestions())
        dispatch(fetchRoundCandidates(tab_data['tab_id']))
        dispatch(fetchSections(tab_data['tab_id']))
    }

    let tabs = roundTabState.round_list.length>0 ? roundTabState.round_list.map(tab => {
        return(
            <div className="pageTabDiv" key={tab['id']}>
                <button className={"pageTab pageTabArrowDiv"} onClick={() => tabClickHandler({tab_name: tab['name'],tab_id: tab['id'],tab_type: tab['type']})}>{tab['name']}</button>
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

export default RoundTabs