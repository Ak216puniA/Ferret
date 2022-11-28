import React from "react";
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { closeCreateSectionDialog, createSection } from "../../features/sectionTab/sectionTabSlice";
import { GrClose } from "react-icons/gr";
import { useState } from "react";

function CreateSectionDialog(props) {
    const { round_id } = props
    const sectionTabState = useSelector((state) => state.sectionTab)
    const dispatch = useDispatch()

    const [sectionName, setSectionName] = useState('')
    const [sectionWeightage, setSectionWeightage] = useState(0)

    const nameChangeHandler = (e) => {
        setSectionName(e.target.value)
    }

    const weightageChangeHandler = (e) => {
        setSectionWeightage(e.target.value)
    }

    const createNewSection = () => {
        dispatch(
            createSection({
                roundId: round_id,
                name: sectionName,
                weightage: sectionWeightage
            })
        )
    }

    return (
        <Dialog 
        open={sectionTabState.open} 
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
                            value={sectionName}
                            placeholder='Section Name' 
                            variant='outlined'
                            fullWidth
                            onChange={nameChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Section Weightage' 
                            type='number' 
                            value={sectionWeightage}
                            placeholder='Section Weightage' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 0 } }}
                            fullWidth
                            onChange={weightageChangeHandler}
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
                    onClick={createNewSection}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default CreateSectionDialog