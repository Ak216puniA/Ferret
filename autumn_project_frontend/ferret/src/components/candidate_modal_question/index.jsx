import { Divider, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IoMdDoneAll } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { openDeleteCofirmationDialog, updateCandidateQuestionStatus } from '../../features/candidateModal/candidateModalSlice'
import './index.css'

function CandidateModalQuestion(props) {
    const {question,index,wsSectionMarks} = props
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const [questionMarks, setQuestionMarks] = useState(0)
    const [questionRemarks, setQuestionRemarks] = useState('')

    const remarkChangeHandler = (event) => {
        setQuestionRemarks(event.target.value)
    }

    const candidateInterviewQuestionDeleteHandler = () => {
        dispatch(
            openDeleteCofirmationDialog({
                open: true,
                questionId: question['id']
            })
        )
    }

    let questionAssigneeComponent = roundTabState.currentTabType==='test' ? 
    <div>({question['assignee']['username']})</div> : 
    <div className='candidateModalQuestionDeleteIconDiv' onClick={candidateInterviewQuestionDeleteHandler}><MdDelete color='#C0392B' size={18} /></div>

    const marksChangeHandler = (event) => {
        setQuestionMarks(event.target.value)
        wsSectionMarks.current.send(
            JSON.stringify({
                id: question['id'],
                marks: event.target.value==='' ? 0 : parseInt(event.target.value),
                section_list: roundTabState.current_sections.map(section => section['id']),
                round_id: roundTabState.currentTabId
            })
        )
        // dispatch(
        //     updateCandidateQuestionMarks({
        //         id: question['id'],
        //         marks: event.target.value
        //     })
        // )
        // dispatch(
        //     fetchSelectedCandidateSectionMarks({
        //         candidate_list: [candidateModalState.candidate_id],
        //         section_list: roundTabState.current_sections.map(section => section['id'])
        //     })
        // )
    }

    const markQuestionChecked = () => {
        dispatch(
            updateCandidateQuestionStatus({
                id: question['id'],
                remarks: questionRemarks,
                status: question['status']==='unchecked' ? 'checked' : 'unchecked'
            })
        )
    }

    const questionDivider = candidateModalState.candidate_question_data.length-1===index ? 
    <Divider 
    style={{
        width:'100%', 
        backgroundColor: '#00ADB5',
        marginTop: '4px',
        marginBottom: '12px'
    }}
    /> :
    <Divider 
    style={{
        width:'100%', 
        backgroundColor: '#F5B041',
        marginTop: '4px',
        marginBottom: '12px'
    }}
    />

    useEffect(() => {
        setQuestionMarks(question['marks'])
        setQuestionRemarks(question['remarks']==='' ? '' : question['remarks'])
    },[])

    return (
        <>
        <div className='candidateModalColumnFlex candidateModalQuestionDiv'>
            <div className='candidateModalRowFlex'>
                <div className='candidateModalQuestionNo'>Q.{index+1}</div>
                {questionAssigneeComponent}
            </div>
            <div className='candidateModalColumnFlex'>
                <div className='candidateModalQuestionText'>{question['question']['text']}</div>
                <div className='candidateModalQuestionMarks'>
                    <TextField 
                    type='number' 
                    value={questionMarks}
                    variant='outlined'
                    onChange={marksChangeHandler}
                    size='small'
                    sx={{
                        justifyContent:"flex-end",
                        width: '64px',
                        padding: '8px 0px',
                        display: 'flex',
                        marginRight: '8px'
                    }}
                    />
                    /{question['question']['marks']}
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
                onChange={remarkChangeHandler}
                sx={{
                    width: '100%',
                    fontSize: '14px',
                    margin: '4px 0px'
                }}
                />
            </div>
            <div className='candidateModalColumnFlex2'>
                <div className='candidateModalCheckButtonDiv'>
                    <button className='candidateModalCheckButton' onClick={markQuestionChecked}><IoMdDoneAll className='tickIcon' size={20}/></button>
                </div>
                <div>Status : {question['status']}</div>
            </div>
        </div>
        {questionDivider}
        </>
    )
}

export default CandidateModalQuestion