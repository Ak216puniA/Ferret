import { Divider, TextField } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { IoMdDoneAll } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { createCandidateInterviewQuestion } from '../../features/candidateModal/candidateModalSlice'
import './index.css'

function CandidateModalInterviewAddQuestion() {
    const candidateModalState = useSelector((state) => state.candidateModal)
    const dispatch = useDispatch()

    const [questionText, setQuestionText] = useState('')
    const [questionTotalMarks, setQuestionTotalMarks] = useState(0)
    const [questionMarks, setQuestionMarks] = useState(0)
    const [questionRemarks, setQuestionRemarks] = useState('')

    const questionTextChangeHandler = (event) => {
        setQuestionText(event.target.value)
    }

    const questionMarksChangeHandler = (event) => {
        setQuestionMarks(event.target.value)
    }

    const questionTotalMarksChangeHandler = (event) => {
        setQuestionTotalMarks(event.target.value)
    }

    const questionRemarksChangeHandler = (event) => {
        setQuestionRemarks(event.target.value)
    }

    const createInterviewQuestion = () => {
        if(questionText!==''){
            dispatch(
                createCandidateInterviewQuestion({
                    candidate_id: candidateModalState.candidate_id,
                    section_id: candidateModalState.section_id,
                    questionText: questionText,
                    questionMarks: questionMarks,
                    questionTotalMarks: questionTotalMarks,
                    questionRemarks: questionRemarks
                })
            )
            setQuestionMarks(0)
            setQuestionRemarks('')
            setQuestionText('')
            setQuestionTotalMarks(0)
        }else{
            alert("Question text is a required field!")
        }
    }

    return (
        <>
        <div className='addCandidateQuestionHeadingDiv'>Create Question</div>
        <div className='candidateModalColumnFlex candidateModalQuestionDiv'>
            <div className='candidateModalRowFlex'>
                <div className='candidateModalQuestionNo'>Q.</div>
            </div>
            <div className='candidateModalColumnFlex'>
                <div className='candidateModalQuestionText'>
                    <TextField 
                    type='text' 
                    value={questionText}
                    variant='outlined'
                    fullWidth
                    multiline={true}
                    rows='2'
                    onChange={questionTextChangeHandler}
                    sx={{
                        width: '100%',
                        fontSize: '14px',
                        margin: '4px 0px'
                    }}
                    />
                </div>
                <div className='candidateModalQuestionMarks'>
                    <TextField 
                    type='number' 
                    value={questionMarks}
                    variant='outlined'
                    onChange={questionMarksChangeHandler}
                    size='small'
                    sx={{
                        justifyContent:"flex-end",
                        width: '64px',
                        padding: '8px 0px',
                        display: 'flex',
                        marginRight: '8px'
                    }}
                    />
                    /
                    <TextField 
                    type='number' 
                    value={questionTotalMarks}
                    variant='outlined'
                    onChange={questionTotalMarksChangeHandler}
                    size='small'
                    sx={{
                        justifyContent:"flex-end",
                        width: '64px',
                        padding: '8px 0px',
                        display: 'flex',
                        marginRight: '8px'
                    }}
                    />
                </div>
            </div>
            <div className='candidateModalColumnFlex'>
                <div>Remarks:</div>
                <TextField 
                type='text' 
                value={questionRemarks}
                variant='outlined'
                fullWidth
                multiline={true}
                rows='2'
                onChange={questionRemarksChangeHandler}
                sx={{
                    width: '100%',
                    fontSize: '14px',
                    margin: '4px 0px'
                }}
                />
            </div>
            <div className='candidateModalColumnFlex2'>
                <div className='candidateModalCheckButtonDiv'>
                    <button className='candidateModalCheckButton' onClick={createInterviewQuestion}><IoMdDoneAll className='tickIcon' size={20}/></button>
                </div>
            </div>
        </div>
        <Divider 
        style={{
            width:'100%', 
            backgroundColor: '#00ADB5',
            marginTop: '4px',
            marginBottom: '12px'
        }}
        />
        </>
    )
}

export default CandidateModalInterviewAddQuestion