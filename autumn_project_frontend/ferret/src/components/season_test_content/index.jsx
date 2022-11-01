import React, { useEffect } from "react";
import SeasonTabDialog from "../season_tab_dialog";
import { useDispatch, useSelector } from "react-redux";
import { openQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice"
import { fetchCSV, fetchRoundCandidates, uploadCSV, resetCSVUpload } from "../../features/seasonRoundContent/seasonRoundContentSlice";
import { Checkbox, Button } from "@mui/material"
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
    const seasonTabState = useSelector((state) => state.seasonTab.currentTabId)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRoundCandidates(seasonTabState))
        dispatch(resetCSVUpload())
    },[])

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

    const csvUploadHandler = (event) => {
        console.log(event.target.files[0])
        dispatch(fetchCSV())
        // dispatch(uploadCSV(event.target.files[0]))
        dispatch(
            uploadCSV({
                'file': event.target.files[0],
                'round_id': seasonTabState
            })
        )
    }
    
    let roundTable = (
        candidates.length>0 ? 
        candidates.map((candidate, index) => <RoundTableRow key={candidate['id']} candidate={candidate['candidate_id']} status={candidate['status']} index={index+1}/>) : 
        <div></div>
    )

    // const CSVTextField = styled(TextField)`
    //     & label.Mui-focused {
    //         color: #00ADB5;
    //     }
    //     & .MuiOutlinedInput-root {
    //         &.Mui-focused fieldset {
    //         border-color: #00ADB5;
    //         }
    //     }
    //     `;

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
                    <div className="rightButton">
                        <button className="seasonTestContentButton">Filter</button>
                    </div>
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
                                    "backgroundColor": "#F5B041",
                                    "height": "24px",
                                    "fontSize": "15px",
                                    "color": "black",
                                    "borderRadius": "0px",
                                    ":hover": {
                                        "backgroundColor": "#D39737"
                                    }
                                }}
                            >
                                csv
                            </Button>
                        </label>
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