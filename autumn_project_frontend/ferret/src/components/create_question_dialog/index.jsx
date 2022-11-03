import React from "react";
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { closeCreateQuestionDialog, handleChangeNewMarks, handleChangeNewAssignee, handleChangeNewText, createQuestion } from "../../features/question/questionSlice";
import { GrClose } from "react-icons/gr";

function CreateQuestionDialog(props) {
    const { section_id } = props
    const questionState = useSelector((state) => state.question)
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    let assignee_list = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['username']}</MenuItem>) : 
    []

    return (
        <Dialog 
        open={questionState.open} 
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
                            onChange={(e) => dispatch(handleChangeNewText(e.target.value))}
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
                            onChange={(e) => dispatch(handleChangeNewMarks(e.target.value))}
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
                                onChange={(e) => dispatch(handleChangeNewAssignee(e.target.value))}
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
                    onClick={() => dispatch(createQuestion(section_id))}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default CreateQuestionDialog