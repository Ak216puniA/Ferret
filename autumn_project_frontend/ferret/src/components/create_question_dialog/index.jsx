import React from "react";
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { closeCreateQuestionDialog, createQuestion } from "../../features/question/questionSlice";
import { GrClose } from "react-icons/gr";
import { useState } from "react";

function CreateQuestionDialog(props) {
    const { section_id } = props
    const questionState = useSelector((state) => state.question.open)
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [questionText, setQuestionText] = useState('')
    const [questionAssignee, setQuestionAssignee] = useState('')
    const [questionMarks, setQuestionMarks] = useState('')

    let assignee_list = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['username']}</MenuItem>) : 
    []

    const createNewQuestion = () => {
        localStorage.setItem('openQuestions',false)
        console.log("createQuestion")
        dispatch(
            createQuestion({
                section_id:section_id,
                questionText:questionText,
                questionMarks:questionMarks,
                questionAssignee:questionAssignee
            })
        )
    }

    const textChangeHandler = (e) => {
        setQuestionText(e.target.value)
    }

    const marksChangeHandler = (e) => {
        setQuestionMarks(e.target.value)
    }

    const assigneeChangeHandler = (e) => {
        setQuestionAssignee(e.target.value)
    }

    return (
        <Dialog 
        open={questionState} 
        onClose={() => dispatch(closeCreateQuestionDialog())}
        className='dialog'
        PaperProps={{ sx: { width: "40%" } }}
        >
            <div className='crossDiv' onClick={() => dispatch(closeCreateQuestionDialog())}><GrClose size={12}/></div>
            <DialogTitle>Create New Recruitment Season</DialogTitle>
            <DialogContent>
                <form id='createSeasonForm' onSubmit={() => dispatch()}>
                    <div className='fieldsDiv'>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Question Statement' 
                            type='text' 
                            placeholder='Question' 
                            variant='outlined'
                            fullWidth
                            multiline='true'
                            rows='3'
                            onChange={textChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Marks' 
                            type='number' 
                            placeholder='Total Marks' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 0 } }}
                            fullWidth
                            onChange={marksChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <FormControl fullWidth>
                                <InputLabel id='assignee'>Assignee</InputLabel>
                                <Select 
                                required 
                                labelId='assignee' 
                                label="Assignee" 
                                variant='outlined'
                                onChange={assigneeChangeHandler}
                                >
                                    {assignee_list}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <div className='createButtonDiv'>
                    <button 
                    className='createButton' 
                    type='submit' 
                    form='createSeasonForm'
                    onClick={createNewQuestion}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default CreateQuestionDialog