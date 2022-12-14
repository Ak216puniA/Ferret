import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { tabClicked, openCreateRoundDialog, fetchSections } from "../../features/roundTab/roundTabSlice";
import { MdAddBox } from "react-icons/md"
import { fetchRoundCandidates, resetMoveCandidatesList } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import "./index.css";
import { resetCheckingModeFilterState, resetFilterState } from "../../features/filter/filterSlice";
import { switchCheckingMode } from "../../features/candidateModal/candidateModalSlice";

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
                        tab_id: roundTabState.round_list[0]['id'],
                        tab_type: roundTabState.round_list[0]['type']
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
                tab_type: tab_data['tab_type']
            })
        )
        dispatch(fetchRoundCandidates(tab_data['tab_id']))
        dispatch(fetchSections(tab_data['tab_id']))
        dispatch(resetFilterState())
        dispatch(resetMoveCandidatesList())
        dispatch(resetCheckingModeFilterState())
        dispatch(switchCheckingMode(false))
    }

    let tabs = roundTabState.round_list.length>0 ? roundTabState.round_list.map(tab => {
        return(
            <div className="pageTabDiv" key={tab['id']}>
                <button className={"pageTab pageTabArrowDiv"} onClick={() => tabClickHandler({tab_name: tab['name'],tab_id: tab['id'],tab_type: tab['type']})}>{tab['name']}</button>
                <div className={"currentTabDownArrowDiv pageTabArrowDiv"}><div className="currentTabDownArrow" id={`${tab['name']}Arrow`}></div></div>
            </div>
        )
    }) : []

    const yearWiseAddRoundButton = localStorage.getItem('year')>2 ?
    <div className="addRoundDiv"><MdAddBox className="addIcon" onClick={() => dispatch(openCreateRoundDialog())} size={28}/></div> :
    <></>

    return (
        <>
            {tabs}
            {yearWiseAddRoundButton}
        </>
    )
}

export default RoundTabs