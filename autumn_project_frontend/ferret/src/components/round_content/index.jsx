import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCSV, uploadCSV, appendCandidateToMove, removeCandidateFromMove, openMoveCandidatesDialog, fetchCandidateSectionMarks, updateSectionMarks, updateCandidateListStatus } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { Checkbox, Button } from "@mui/material"
import './index.css';
import CreateRoundDialog from "../create_round_dialog";
import MoveCandidatesDialog from "../move_candidates_dialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCandidate, fetchCandidateQuestionDataInCheckingMode, fetchSelectedCandidateSectionMarks, openCandidateModal, updateCandidateModalQuestionData, updatedCandidateModalRoundStatus } from "../../features/candidateModal/candidateModalSlice";
import { openFilterDrawer } from "../../features/filter/filterSlice";
import FilterDrawer from "../filter_drawer";
import { fetchCurrentSectionsTotalMarks } from "../../features/roundTab/roundTabSlice";
import CandidateInterviewModal from "../candidate_interview_modal";
import CandidateTestModal from "../candidate_test_modal";
import { CANDIDATE_QUESTION_WEBSOCKET, CANDIDATE_ROUND_WEBSOCKET } from "../../urls";

function RoundTableRow(props){
    const { candidateRound, index } = props
    const section_marks = useSelector((state) => state.seasonRoundContent.section_marks)
    const roundTabState = useSelector((state) => state.roundTab)
    const checkingMode = useSelector((state) => state.candidateModal.checkingMode)
    const filterState = useSelector((state) => state.filter)
    const dispatch = useDispatch()

    let candidate_section_marks = section_marks[index-1]

    const checkboxClickHandler = (event) => {
        if (event.target.checked){
            dispatch(appendCandidateToMove(candidateRound['candidate_id']['id']))
        }
        if (!event.target.checked){
            dispatch(removeCandidateFromMove(candidateRound['candidate_id']['id']))
        }
    }

    const candidateClickHandler = () => {
        dispatch(
            openCandidateModal({
                open: true,
                candidate_id: candidateRound['candidate_id']['id'],
                candidateRoundId: candidateRound['id'],
                candidateRoundStatus: candidateRound['status'],
                candidateRoundRemarks: candidateRound['remark']
            })
        )
        dispatch(fetchCandidate(candidateRound['candidate_id']['id']))
        if(checkingMode===true){
            const questionId = filterState.question!=='' && filterState.question>0 ? 
            [filterState.question] :
            filterState.assigneeQuestionList.map(question => question['id'])
            dispatch(
                fetchCandidateQuestionDataInCheckingMode({
                    candidateId: candidateRound['candidate_id']['id'],
                    questionId: questionId
                })
            )
        }else{
            dispatch(
                fetchSelectedCandidateSectionMarks({
                    candidate_list: [candidateRound['candidate_id']['id']],
                    section_list: roundTabState.current_sections.map((section) => section['id'])
                })
            )
            dispatch(
                fetchCurrentSectionsTotalMarks({
                    candidateId: candidateRound['candidate_id']['id'],
                    sectionList: roundTabState.current_sections.map((section) => section['id'])
                })
            )
        }
    }

    let candidate_marks = <></>
    if(candidate_section_marks!=null && localStorage.getItem('year')>2){
        candidate_marks = (
            candidate_section_marks.length>0 ?
            candidate_section_marks.map((marks,index) => {
                if(index>0) return <div key={index} className={`roundContentCandidateSection singleElementRowFlex`}>{marks}</div>
            }) :
            <div></div>
        )
    }

    const yearWiseCheckbox = localStorage.getItem('year')>2 ?
    <div className={`roundContentCheckbox  singleElementRowFlex`}>
        <Checkbox 
        size="small" 
        sx={{color: '#00ADB5'}}
        onChange={checkboxClickHandler}
        />
    </div> :
    <></>

    const roundTypeWiseTimeSlot = roundTabState.currentTabType==='interview' ?
    <div className={`roundContentCandidateStatus singleElementRowFlex`}>{candidateRound['time_slot']}</div> :
    <></>

    return (
        <>
        <div className='roundCandidateRow'>
            {yearWiseCheckbox}
            <div className={`roundContentIndex singleElementRowFlex`}>{index}</div>
            <div className={`roundContentCandidateName singleElementRowFlex`} onClick={candidateClickHandler}>{candidateRound['candidate_id']['name']}</div>
            <div className={`roundContentCandidateStatus singleElementRowFlex`}>{candidateRound['status']}</div>
            {roundTypeWiseTimeSlot}
            {candidate_marks}
        </div>
        </>
    )
}

function RoundContent(props) {
    const { s_id, wsSeasonRounds } = props
    const seasonRoundContentState = useSelector((state) => state.seasonRoundContent)
    const roundTabState = useSelector((state) => state.roundTab)
    const candidateModalState = useSelector((state) => state.candidateModal)
    const dispatch = useDispatch()
    let wsCandidateQuestion = useRef('')
    let wsCandidateRound = useRef('')

    if(wsCandidateQuestion.current!==''){
        wsCandidateQuestion.current.onopen = () => {
            console.log("Candidate question websocket connection opened!")
        }
        wsCandidateQuestion.current.onmessage = (event) => {
            const candidateQuestionData = JSON.parse(event.data)
            const candidate_id = candidateQuestionData['candidate_marks']['candidate_id']['id']
            if(candidateQuestionData['round_id']===roundTabState.currentTabId){
                if(candidateQuestionData['field']==='marks'){
                    dispatch(updateSectionMarks(candidateQuestionData))
                }
                if(candidate_id===candidateModalState.candidate_id) {
                    dispatch(updateCandidateModalQuestionData(candidateQuestionData))
                }
            }
        }
        wsCandidateQuestion.current.onerror = (event) => {
            console.log("Error in websocket connection!")
            console.log(event.data)
        }
        wsCandidateQuestion.current.onclose = () => {
            console.log("Websocket connection closed!")
        }
    }

    if(wsCandidateRound.current!==''){
        wsCandidateRound.current.onopen = () => {
            console.log("Candidate round websocket connection opened!")
        }
        wsCandidateRound.current.onmessage = (event) => {
            const candidateRoundData = JSON.parse(event.data)
            const candidate_id = candidateRoundData['candidate_round']['candidate_id']['id']
            if(candidateRoundData['candidate_round']['round_id']['id']===roundTabState.currentTabId){
                dispatch(
                    updateCandidateListStatus({
                        field: candidateRoundData['field'],
                        value: candidateRoundData['candidate_round']
                    })
                )
                if(candidate_id===candidateModalState.candidate_id){
                    dispatch(
                        updatedCandidateModalRoundStatus({
                            field: candidateRoundData['field'],
                            value: candidateRoundData['candidate_round']
                        })
                    )
                }
            }
        }
        wsCandidateRound.current.onerror = (event) => {
            console.log("Error in websocket connection!")
            console.log(event.data)
        }
        wsCandidateRound.current.onclose = () => {
            console.log("Websocket connection closed!")
        }
    }

    let navigate = useNavigate()
    const routeChange = () => {
        localStorage.setItem('questions','open')
        const url = `/season/${s_id}/${roundTabState.currentTabId}/questions`
        navigate(url)
    }

    useEffect(() => {
        if(roundTabState.currentTabId>0) {
            wsCandidateQuestion.current = new WebSocket(`${CANDIDATE_QUESTION_WEBSOCKET}${roundTabState.currentTabId}/`)
            wsCandidateRound.current = new WebSocket(`${CANDIDATE_ROUND_WEBSOCKET}${roundTabState.currentTabId}/`)
        }
    },[roundTabState.currentTabId])

    useEffect(() => {
        if(seasonRoundContentState.candidatesUpdated===true && roundTabState.sectionsUpdated===true){
            dispatch(
                fetchCandidateSectionMarks({
                    candidate_list: seasonRoundContentState.candidate_list.map(candidate => candidate['candidate_id']['id']),
                    section_list: roundTabState.current_sections.map(section => section['id'])
                })
            )
        }
    },[seasonRoundContentState.candidatesUpdated,roundTabState.sectionsUpdated])

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

    const filterCandidatesHandler = () => {
        dispatch(openFilterDrawer(true))
    }

    const move_button = localStorage.getItem('year')>2 ? 
    <button id="moveCandidateButton" className="seasonTestContentButton" onClick={moveClickHandler}>Move</button> :
    <></>

    const csv_button = current_round_index===0 && localStorage.getItem('year')>2 ?
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
        seasonRoundContentState.candidate_list.map((candidateRound, index) => <RoundTableRow key={candidateRound['id']} candidateRound={candidateRound} index={index+1}/>) : 
        <div></div>
    )

    let roundTableSectionHeading = localStorage.getItem('year')>2 ? 
    (
        roundTabState.current_sections.length>0 ?
        roundTabState.current_sections.map((section) => <div key={section['id']} className={`roundContentCandidateSection singleElementRowFlex`}>{section['name']}</div>) :
        <div></div>
    ) :
    <></>

    const yearWiseCheckboxHeadingRowPadding = localStorage.getItem('year')>2 ? 
    <div className={`roundContentCheckbox  singleElementRowFlex`}></div> :
    <></>

    const roundTypeWiseTimeSlotHeading = roundTabState.currentTabType==='interview' ?
    <div className={`roundContentCandidateStatus singleElementRowFlex`}>Time slot</div> :
    <></>

    let candidateModal = roundTabState.currentTabType==='test' ? 
    <CandidateTestModal wsCandidateQuestion={wsCandidateQuestion} wsCandidateRound={wsCandidateRound}/> : 
    <CandidateInterviewModal wsCandidateQuestion={wsCandidateQuestion} wsCandidateRound={wsCandidateRound}/>

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
                    {yearWiseCheckboxHeadingRowPadding}
                    <div className={`roundContentIndex singleElementRowFlex`}>S.No.</div>
                    <div className={`roundContentCandidateNameHeading singleElementRowFlex`}>Name</div>
                    <div className={`roundContentCandidateStatus singleElementRowFlex`}>Status</div>
                    {roundTypeWiseTimeSlotHeading}
                    {roundTableSectionHeading}
                </div>
                {roundTable}
            </div>
            <CreateRoundDialog season_id={s_id}/>
            {move_button}
            {candidateModal}
            <MoveCandidatesDialog wsSeasonRounds={wsSeasonRounds}/>
            <FilterDrawer />
        </div>
    )
}

export default RoundContent