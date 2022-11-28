import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import { MdAddBox } from "react-icons/md"
import {tabClicked, openCreateSectionDialog} from "../../features/sectionTab/sectionTabSlice"
import { fetchQuestions } from "../../features/question/questionSlice"
import "./index.css";

function SectionTabs(props) {
    const { section_tabs } = props
    const sections = section_tabs

    const sectionTabState = useSelector((state) => state.sectionTab)
    const dispatch = useDispatch()

    useEffect(() => {
        if(sections.length>0){
            if(sectionTabState.currentTab===''){
                document.getElementById(`${sections[0]['name']}Arrow`).style.display = 'block'
                dispatch(tabClicked(
                    {
                        tab_name: sections[0]['name'],
                        tab_id: sections[0]['id']
                    }
                ))
                dispatch(fetchQuestions(sections[0]['id']))
            }else{
                sections.forEach(tab => {
                    document.getElementById(`${tab['name']}Arrow`).style.display = (tab['name']===sectionTabState.currentTab) ? 'block' : 'none'
                });
                dispatch(fetchQuestions(sectionTabState.currentTabId))
            }
        }
    })

    let tabs = sections.map(tab => {
        return(
            <div className="pageTabDiv" key={tab['id']}>
                <button className={"pageTab pageTabArrowDiv"} onClick={() => dispatch(tabClicked({tab_name: tab['name'], tab_id: tab['id']}))}>{tab['name']}</button>
                <div className={"currentTabDownArrowDiv pageTabArrowDiv"}><div className="currentTabDownArrow" id={`${tab['name']}Arrow`}></div></div>
            </div>
        )
    })

    return (
        <>
            {tabs}
            <div className="addRoundDiv"><MdAddBox className="addIcon" onClick={() => dispatch(openCreateSectionDialog())} size={28}/></div>
        </>
    )
}

export default SectionTabs