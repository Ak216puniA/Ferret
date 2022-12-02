import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { openQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice"
import { fetchCSV, uploadCSV, appendCandidateToMove, removeCandidateFromMove, openMoveCandidatesDialog, fetchCandidateSectionMarks } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { Checkbox, Button } from "@mui/material"
import './index.css';
import CreateRoundDialog from "../create_round_dialog";
import MoveCandidatesDialog from "../move_candidates_dialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateModal from "../candidate_modal";
import { fetchCandidate, fetchSelectedCandidateSectionMarks, openCandidateModal } from "../../features/candidateModal/candidateModalSlice";
import { openFilterDrawer } from "../../features/filter/filterSlice";
import FilterDrawer from "../filter_drawer";

function RoundTableRow(props){
    const {candidate, status, index} = props
    const section_marks = useSelector((state) => state.seasonRoundContent.section_marks)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    let candidate_section_marks = section_marks[index-1]

    const checkboxClickHandler = (event) => {
        if (event.target.checked){
            dispatch(appendCandidateToMove(candidate['id']))
        }
        if (!event.target.checked){
            dispatch(removeCandidateFromMove(candidate['id']))
        }
    }

    const candidateClickHandler = () => {
        dispatch(
            openCandidateModal({
                open: true,
                candidate_id: candidate['id']
            })
        )
        dispatch(fetchCandidate(candidate['id']))
        dispatch(
            fetchSelectedCandidateSectionMarks({
                candidate_list: [candidate['id']],
                section_list: roundTabState.current_sections.map((section) => section['id'])
            })
        )
    }

    let candidate_marks = <></>
    if(candidate_section_marks!=null){
        candidate_marks = (
            candidate_section_marks.length>0 ?
            candidate_section_marks.map((marks,index) => {
                if(index>0) return <div key={index} className={`roundContentCandidateSection singleElementRowFlex`}>{marks}</div>
            }) :
            <div></div>
        )
    }

    return (
        <>
        <div className='roundCandidateRow'>
            <div className={`roundContentCheckbox  singleElementRowFlex`}>
                <Checkbox 
                size="small" 
                sx={{color: '#00ADB5'}}
                onChange={checkboxClickHandler}
                />
            </div>
            <div className={`roundContentIndex singleElementRowFlex`}>{index}</div>
            <div className={`roundContentCandidateName singleElementRowFlex`} onClick={candidateClickHandler}>{candidate['name']}</div>
            <div className={`roundContentCandidateStatus singleElementRowFlex`}>{status}</div>
            {candidate_marks}
        </div>
        <CandidateModal />
        </>
    )
}

function RoundContent(props) {
    const { s_id } = props
    const seasonRoundContentState = useSelector((state) => state.seasonRoundContent)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    let navigate = useNavigate()
    const routeChange = () => {
        localStorage.setItem('questions','open')
        const url = `/season/${s_id}/${roundTabState.currentTabId}/questions`
        navigate(url)
    }

    useEffect(() => {
        dispatch(
            fetchCandidateSectionMarks({
                candidate_list: seasonRoundContentState.candidate_list.map(candidate => candidate['candidate_id']['id']),
                section_list: roundTabState.current_sections.map(section => section['id'])
            })
        )
    },[seasonRoundContentState.candidate_list,roundTabState.current_sections,dispatch])

    let current_round_index = -1
    for(let index=0; index<roundTabState.round_list.length; index++){
        if(roundTabState.round_list[index]['id']===roundTabState.currentTabId) current_round_index = index
    }

    const csvUploadHandler = (event) => {
        dispatch(fetchCSV())
        dispatch(
            uploadCSV({
                'file': event.target.files[0],
                'round_id': roundTabState.currentTabId
            })
        )
    }

    const moveClickHandler = (() => {
        dispatch(openMoveCandidatesDialog())
    })

    // const openQuestionsHandler = () => {
    //     dispatch(openQuestions())
    //     localStorage.setItem('openQuestions',true)
    // }

    const filterCandidatesHandler = () => {
        dispatch(openFilterDrawer(true))
    }

    const move_button = <button id="moveCandidateButton" className="seasonTestContentButton" onClick={moveClickHandler}>Move</button>

    const csv_button = current_round_index===0 ?
    <div className="rightButton">
        <label htmlFor="uploadCSV">
            <input
                style={{ display: 'none' }}
                id="uploadCSV"
                name="uploadCSV"
                type="file"
                onChange={csvUploadHandler}
            />
            <Button 
                variant="contained" 
                component="span"
                sx={{
                    "backgroundColor": "#00ADB5",
                    "height": "24px",
                    "fontSize": "15px",
                    "color": "black",
                    "borderRadius": "0px",
                    ":hover": {
                        "backgroundColor": "#0099A0"
                    }
                }}
            >
                csv
            </Button>
        </label>
    </div> :
    <></>
    
    let roundTable = (
        seasonRoundContentState.candidate_list.length>0 ? 
        seasonRoundContentState.candidate_list.map((candidate, index) => <RoundTableRow key={candidate['id']} candidate={candidate['candidate_id']} status={candidate['status']} index={index+1}/>) : 
        <div></div>
    )

    let roundTableSectionHeading = (
        roundTabState.current_sections.length>0 ?
        roundTabState.current_sections.map((section) => <div key={section['id']} className={`roundContentCandidateSection singleElementRowFlex`}>{section['name']}</div>) :
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
                    <button className="seasonTestContentButton" onClick={() => routeChange()}>Questions</button>
                </div>
                <div className="rightButtonDiv">
                    <div className="rightButton">
                        <button className="seasonTestContentButton" onClick={filterCandidatesHandler}>Filter</button>
                    </div>
                    {csv_button}
                </div>
            </div>
            <div className="roundContentDiv">
                <div className='roundHeadingRow'>
                    <div className={`roundContentCheckbox  singleElementRowFlex`}></div>
                    <div className={`roundContentIndex singleElementRowFlex`}>S.No.</div>
                    <div className={`roundContentCandidateNameHeading singleElementRowFlex`}>Name</div>
                    <div className={`roundContentCandidateStatus singleElementRowFlex`}>Status</div>
                    {roundTableSectionHeading}
                </div>
                {roundTable}
            </div>
            <CreateRoundDialog season_id={s_id}/>
            {move_button}
            <MoveCandidatesDialog />
            <FilterDrawer />
        </div>
    )
}

export default RoundContent