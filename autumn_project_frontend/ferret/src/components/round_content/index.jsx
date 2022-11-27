import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice"
import { fetchCSV, uploadCSV, appendCandidateToMove, removeCandidateFromMove, moveCandidates } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { Checkbox, Button } from "@mui/material"
import './index.css';
import CreateRoundDialog from "../create_round_dialog";

function RoundTableRow(props){
    const {candidate, status, index} = props
    const dispatch = useDispatch()

    const checkboxClickHandler = (event) => {
        if (event.target.checked){
            dispatch(appendCandidateToMove(candidate['id']))
        }
        if (!event.target.checked){
            dispatch(removeCandidateFromMove(candidate['id']))
        }
    }

    return (
        <div className='roundCandidateRow'>
            <div className={`roundContentCheckbox  singleElementRowFlex`}>
                <Checkbox 
                size="small" 
                sx={{color: '#00ADB5'}}
                onChange={checkboxClickHandler}
                />
            </div>
            <div className={`roundContentIndex singleElementRowFlex`}>{index}</div>
            <div className={`roundContentCandidateName singleElementRowFlex`}>{candidate['name']}</div>
            <div className={`roundContentCandidateStatus singleElementRowFlex`}>{status}</div>
        </div>
    )
}

function RoundContent(props) {
    const { s_id } = props
    const seasonRoundContentState = useSelector((state) => state.seasonRoundContent)
    const seasonTabState = useSelector((state) => state.seasonTab)
    const dispatch = useDispatch()

    const candidates = seasonRoundContentState.candidate_list.length>0 ? 
    seasonRoundContentState.candidate_list : []

    let next_round_id = -1
    let current_round_index = -1
    for(let index=0; index<seasonTabState.round_list.length; index++){
        if(seasonTabState.round_list[index]['id']===seasonTabState.currentTabId){
            current_round_index = index
            if(index>=seasonTabState.round_list.length-1){
                next_round_id = -1
            }else{
                next_round_id = seasonTabState.round_list[index+1]['id']
            }
        }
    }

    const csvUploadHandler = (event) => {
        console.log(event.target.files[0])
        dispatch(fetchCSV())
        dispatch(
            uploadCSV({
                'file': event.target.files[0],
                'round_id': seasonTabState.currentTabId
            })
        )
    }

    const moveClickHandler = (() => {
        dispatch(
            moveCandidates({
                'candidate_list': seasonRoundContentState.move_candidate_list,
                'next_round_id': next_round_id,
                'current_round_id': seasonTabState.currentTabId
            })
        )
    })

    const openQuestionsHandler = () => {
        dispatch(openQuestions())
        localStorage.setItem('openQuestions',true)
    }

    const move_button = next_round_id>0 ? 
    <button id="moveCandidateButton" className="seasonTestContentButton" onClick={moveClickHandler}>Move</button> :
    <></>

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
                    <button className="seasonTestContentButton" onClick={openQuestionsHandler}>Questions</button>
                </div>
                <div className="rightButtonDiv">
                    <div className="rightButton">
                        <button className="seasonTestContentButton">Filter</button>
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
                </div>
                {roundTable}
            </div>
            <CreateRoundDialog season_id={s_id}/>
            {move_button}
        </div>
    )
}

export default RoundContent