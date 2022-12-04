import { Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { IoMdDoneAll } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { chooseCandidateInterviewQuestion } from '../../features/candidateModal/candidateModalSlice'
import './index.css'

function CandidateModalInterviewChooseQuestion() {
    const questionState = useSelector((state) => state.question)
    const candidateModalState = useSelector((state) => state.candidateModal)
    const dispatch = useDispatch()

    const [question, setQuestion] = useState('')

    const questionTextChangeHandler = (event) => {
        setQuestion(event.target.value)
    }

    const chooseInterviewQuestion = () => {
        console.log(question)
        dispatch(
            chooseCandidateInterviewQuestion({
                candidateId: candidateModalState.candidate_id,
                questionId: question
            })
        )
        setQuestion('')
    }

    const interviewQuestionOptions = questionState.questions.length>0 ? 
    questionState.questions.map(option => <MenuItem key={option['id']} value={option['id']}>{option['text']} ({option['marks']} marks)</MenuItem>) :
    []

    return (
        <>
        <div className='addCandidateQuestionHeadingDiv'>Choose Question</div>
        <div className='questionOptionsDiv'>
            <FormControl fullWidth>
                <InputLabel id='questionOptions'>Questions</InputLabel>
                <Select 
                required 
                labelid='questionOptions' 
                label='Questions'
                value={question}
                placeholder='Filtering criteria' 
                variant='outlined'
                onChange={questionTextChangeHandler}
                >
                    {interviewQuestionOptions}
                </Select>
            </FormControl>
        </div>
        <div className='candidateModalColumnFlex2'>
            <div className='candidateModalCheckButtonDiv'>
                <button className='candidateModalCheckButton' onClick={chooseInterviewQuestion}><IoMdDoneAll className='tickIcon' size={20}/></button>
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

export default CandidateModalInterviewChooseQuestion