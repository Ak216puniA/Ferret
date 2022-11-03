import React from "react";
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { closeCreateSectionDialog, handleChangeNewName, handleChangeNewWeightage, createSection } from "../../features/questionSectionTab/questionSectionTabSlice";
import { GrClose } from "react-icons/gr";

function QuestionSectionTabDialog(props) {
    const { round_id } = props
    const questionSectionTabState = useSelector((state) => state.questionSectionTab)
    const dispatch = useDispatch()

    return (
        <Dialog 
        open={questionSectionTabState.open} 
        onClose={() => dispatch(closeCreateSectionDialog())}
        className='dialog'
        >
            <div className='crossDiv' onClick={() => dispatch(closeCreateSectionDialog())}><GrClose size={12}/></div>
            <DialogTitle>Create New Recruitment Season</DialogTitle>
            <DialogContent>
                <form id='createSeasonForm' onSubmit={() => dispatch()}>
                    <div className='fieldsDiv'>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Name' 
                            type='text' 
                            placeholder='Section Name' 
                            variant='outlined'
                            fullWidth
                            onChange={(e) => dispatch(handleChangeNewName(e.target.value))}
                            />
                        </div>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Section Weightage' 
                            type='number' 
                            placeholder='Section Weightage' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 0 } }}
                            fullWidth
                            onChange={(e) => dispatch(handleChangeNewWeightage(e.target.value))}
                            />
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
                    onClick={() => dispatch(createSection(round_id))}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default QuestionSectionTabDialog