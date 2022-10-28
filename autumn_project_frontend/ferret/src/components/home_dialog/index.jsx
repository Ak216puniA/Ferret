import React from 'react';
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { closeCreateSeasonDialog, handleChangeNewYear, handleChangeNewType, createSeason} from '../../features/season/seasonSlice'
import { GrClose } from "react-icons/gr";

function HomeDialog() {
    const seasonState = useSelector((state) => state.season)
    const dispatch = useDispatch()

    return (
        <Dialog 
        open={seasonState.open} 
        onClose={() => dispatch(closeCreateSeasonDialog())}
        className='dialog'
        >
            <div className='crossDiv' onClick={() => dispatch(closeCreateSeasonDialog())}><GrClose size={12}/></div>
            <DialogTitle>Create New Recruitment Season</DialogTitle>
            <DialogContent>
                <form id='createSeasonForm' onSubmit={() => dispatch()}>
                    <div className='fieldsDiv'>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Academic Year' 
                            type='number' 
                            placeholder='yyyy' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 0, max: 10 } }}
                            fullWidth
                            onChange={(e) => dispatch(handleChangeNewYear(e.target.value))}
                            />
                        </div>
                        <div className='field'>
                            <FormControl fullWidth>
                                <InputLabel id='type'>Season Type</InputLabel>
                                <Select 
                                required 
                                labelId='type' 
                                label="Season type" 
                                defaultValue={seasonState.new_type}
                                variant='outlined'
                                onChange={(e) => dispatch(handleChangeNewType(e.target.value))}
                                >
                                    <MenuItem value={'developer'}>Developer</MenuItem>
                                    <MenuItem value={'designer'}>Designer</MenuItem>
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
                    onClick={() => dispatch(createSeason())}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default HomeDialog