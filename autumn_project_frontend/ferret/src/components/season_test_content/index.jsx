import React from "react";
import SeasonTabDialog from "../season_tab_dialog";
import { useDispatch, useSelector } from "react-redux";
import { openQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice"
import { Checkbox } from "@mui/material"
import './index.css';

function RoundTableRow(props){
    const {candidate, status, index} = props
    return (
        <div className='roundCandidateRow'>
            <div className={`roundContentCheckbox  singleElementRowFlex`}><Checkbox size="small" sx={{color: '#00ADB5'}}/></div>
            <div className={`roundContentIndex singleElementRowFlex`}>{index}</div>
            <div className={`roundContentCandidateName singleElementRowFlex`}>{candidate['name']}</div>
            <div className={`roundContentCandidateStatus singleElementRowFlex`}>{status}</div>
        </div>
    )
}

function SeasonTestContent(props) {
    const { s_id } = props
    const seasonRoundContentState = useSelector((state) => state.seasonRoundContent)
    const dispatch = useDispatch()

    const candidates = seasonRoundContentState.candidate_list.length>0 ? 
    seasonRoundContentState.candidate_list :
    [
        {
            id: 1,
            candidate_id: {
                name: "Harry Potter"
            },
            status: "Pending"
        },
        {
            id: 2,
            candidate_id: {
                name: "Hermione Granger"
            },
            status: "Done"
        }
    ]
    
    let roundTable = (
        candidates.length>0 ? 
        candidates.map((candidate, index) => <RoundTableRow key={candidate['id']} candidate={candidate['candidate_id']} status={candidate['status']} index={index+1}/>) : 
        <div></div>
    )

    return (
        <div className="seasonTestContent">
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className="seasonTestContentButtonDiv">
                <div className="leftButtonDiv">
                    <button className="seasonTestContentButton" onClick={() => dispatch(openQuestions())}>Questions</button>
                </div>
                <div className="rightButtonDiv">
                    <div className="filterButtonDiv">
                        <button className="seasonTestContentButton">Filter</button>
                    </div>
                </div>
            </div>
            <div className="roundContentDiv">
                <div className='roundHeadingRow'>
                    <div className={`roundContentCheckbox  singleElementRowFlex`}></div>
                    <div className={`roundContentIndex singleElementRowFlex`}>S.No.</div>
                    <div className={`roundContentCandidateNameHeading singleElementRowFlex`}>Name</div>
                    <div className={`roundContentCandidateStatus singleElementRowFlex`}>Status</div>
                </div>
                {roundTable}
            </div>
            <SeasonTabDialog season_id={s_id}/>
        </div>
    )
}

export default SeasonTestContent