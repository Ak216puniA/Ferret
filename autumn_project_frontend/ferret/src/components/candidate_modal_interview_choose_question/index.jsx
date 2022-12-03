import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function CandidateModalInterviewChooseQuestion() {
    const questionState = useSelector((state) => state.question)

    const [questionText, setQuestionText] = useState('')

    const questionTextChangeHandler = (event) => {
        setQuestionText(event.target.value)
    }

    const interviewQuestionOptions = questionState.questions.length>0 ? 
    questionState.questions.map(question => <MenuItem value={question['id']}>{question['text']} ({question['marks']} marks)</MenuItem>) :
    []

    return (
        <>
        <div>Choose Question</div>
        <FormControl fullWidth>
            <InputLabel id='questionOptions'>Questions</InputLabel>
            <Select 
            required 
            labelid='questionOptions' 
            label='Questions'
            value={questionText}
            placeholder='Filtering criteria' 
            variant='outlined'
            onChange={questionTextChangeHandler}
            >
                {interviewQuestionOptions}
            </Select>
        </FormControl>
        </>
    )
}

export default CandidateModalInterviewChooseQuestion