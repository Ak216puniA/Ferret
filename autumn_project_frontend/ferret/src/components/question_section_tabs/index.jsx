import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import { MdAddBox } from "react-icons/md"
import {tabClicked, openCreateSectionDialog} from "../../features/questionSectionTab/questionSectionTabSlice"
import { fetchQuestions } from "../../features/question/questionSlice"
import "./index.css";

function QuestionSectionTabs(props) {
    const { section_tabs } = props
    const sections = section_tabs

    const questionSectionTabState = useSelector((state) => state.questionSectionTab)
    const dispatch = useDispatch()

    useEffect(() => {
        if(sections.length>0){
            if(questionSectionTabState.currentTab===''){
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
                    document.getElementById(`${tab['name']}Arrow`).style.display = (tab['name']===questionSectionTabState.currentTab) ? 'block' : 'none'
                });
                dispatch(fetchQuestions(questionSectionTabState.currentTabId))
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

export default QuestionSectionTabs