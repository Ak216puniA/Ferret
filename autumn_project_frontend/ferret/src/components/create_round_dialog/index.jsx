import React from "react";
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { closeCreateRoundDialog, createRound } from "../../features/roundTab/roundTabSlice";
import { GrClose } from "react-icons/gr";
import { useState } from "react";

function CreateRoundDialog(props) {
    const { season_id } = props
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const [roundTitle, setRoundTitle] = useState('')
    const [roundType, setRoundType] = useState('')

    const titleChangeHandler = (e) => {
        setRoundTitle(e.target.value)
    }

    const typeChangeHandler = (e) => {
        setRoundType(e.target.value)
    }

    const createNewRound = () => {
        dispatch(
            createRound({
                season_id: season_id,
                roundTitle: roundTitle,
                roundType: roundType
            })
        )
    }

    return (
        <Dialog 
        open={roundTabState.open} 
        onClose={() => dispatch(closeCreateRoundDialog())}
        className='dialog'
        >
            <div className='crossDiv' onClick={() => dispatch(closeCreateRoundDialog())}><GrClose size={12}/></div>
            <DialogTitle>Create New Recruitment Season</DialogTitle>
            <DialogContent>
                <form id='createSeasonForm' onSubmit={() => dispatch()}>
                    <div className='fieldsDiv'>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Title' 
                            type='text'
                            value={roundTitle}
                            placeholder='Title' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 2000, max: 2100 } }}
                            fullWidth
                            onChange={titleChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <FormControl fullWidth>
                                <InputLabel id='type'>Round Type</InputLabel>
                                <Select 
                                required 
                                labelId='type' 
                                label="Round type" 
                                value={roundType}
                                placeholder='Test/Interview' 
                                variant='outlined'
                                onChange={typeChangeHandler}
                                >
                                    <MenuItem value={'test'}>Test</MenuItem>
                                    <MenuItem value={'interview'}>Interview</MenuItem>
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
                    onClick={createNewRound}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default CreateRoundDialog