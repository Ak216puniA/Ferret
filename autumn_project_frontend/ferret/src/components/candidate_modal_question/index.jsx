import { Divider, TextField } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { IoMdDoneAll } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCandidateInterviewQuestion, fetchSelectedCandidateSectionMarks, openDeleteCofirmationDialog, updateCandidateQuestionMarks, updateCandidateQuestionStatus } from '../../features/candidateModal/candidateModalSlice'
import DeleteConfirmationDialog from '../delete_confirmation_dialog'
import './index.css'

function CandidateModalQuestion(props) {
    const {question,index} = props
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const [questionMarks, setQuestionMarks] = useState()
    const [questionRemarks, setQuestionRemarks] = useState()

    const remarkChangeHandler = (event) => {
        setQuestionRemarks(event.target.value)
    }

    const candidateInterviewQuestionDeleteHandler = () => {
        dispatch(openDeleteCofirmationDialog(true))
    }

    let questionAssigneeComponent = roundTabState.currentTabType==='test' ? 
    <div>({question['assignee']['username']})</div> : 
    <div className='candidateModalQuestionDeleteIconDiv' onClick={candidateInterviewQuestionDeleteHandler}><MdDelete color='#C0392B' size={18} /></div>

    const marksChangeHandler = (event) => {
        setQuestionMarks(event.target.value)
        dispatch(
            updateCandidateQuestionMarks({
                id: question['id'],
                marks: event.target.value
            })
        )
        dispatch(
            fetchSelectedCandidateSectionMarks({
                candidate_list: [candidateModalState.candidate_id],
                section_list: roundTabState.current_sections.map(section => section['id'])
            })
        )
    }

    const markQuestionChecked = () => {
        dispatch(
            updateCandidateQuestionStatus({
                id: question['id'],
                remarks: questionRemarks
            })
        )
    }

    const dialogCloseHandler = () => {
        dispatch(openDeleteCofirmationDialog(false))
    }

    const agreeActionClickHandler = () => {
        dispatch(
            deleteCandidateInterviewQuestion({
                candidateMarksId: question['id']
            })
        )
    }

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
        <Divider 
        style={{
            width:'100%', 
            backgroundColor: '#F5B041',
            marginTop: '4px',
            marginBottom: '12px'
        }}
        />
        <DeleteConfirmationDialog
        open={candidateModalState.openDeleteDialog} 
        dialogCloseHandler={dialogCloseHandler} 
        agreeActionClickHandler={agreeActionClickHandler}
        />
        </>
    )
}

export default CandidateModalQuestion