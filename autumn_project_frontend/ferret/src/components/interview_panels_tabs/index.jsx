import React from 'react'
import { MdAddBox } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { openCreateInterviewPanelDialog } from '../../features/interviewPanel/interviewPanelSlice'
import './index.css'

function InterviewPanelsTabs(props) {
    const { seasonId } = props
    const dispatch = useDispatch()

    const yearWiseAddRoundButton = localStorage.getItem('year')>2 && seasonId>0 ?
    <div className="addRoundDiv"><MdAddBox className="addIcon" onClick={() => dispatch(openCreateInterviewPanelDialog(true))} size={28}/></div> :
    <></>

    return (
        <>
            <div className="pageTabDiv">
                <button className={"pageTab pageTabArrowDiv"}>Interview Panels</button>
                <div className={"currentTabDownArrowDiv pageTabArrowDiv"}><div className={"currentTabDownArrow"} id="interviewPanelsDownArrow"></div></div>
            </div>
            {yearWiseAddRoundButton}
        </>
    )
}

export default InterviewPanelsTabs