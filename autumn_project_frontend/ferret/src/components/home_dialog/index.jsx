import React from 'react';
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { closeCreateSeasonDialog, handleChangeNewYear, handleChangeNewType, createSeason} from '../../features/season/seasonSlice'
import { GrClose } from "react-icons/gr";
import { useState } from 'react';

function HomeDialog() {
    const seasonState = useSelector((state) => state.season)
    const dispatch = useDispatch()

    const [seasonYear, setSeasonYear] = useState()
    const [seasonType, setSeasonType] = useState()
    const [seasonDesc, setSeasonDesc] = useState('')

    const yearChangeHandler = (e) => {
        setSeasonYear(e.target.value)
    }

    const typeChangeHandler = (e) => {
        setSeasonType(e.target.value)
    }

    const descChangeHandler = (e) => {
        setSeasonDesc(e.target.value)
    }

    const createNewSeason = () => {
        dispatch(
            createSeason({
                year: seasonYear,
                type: seasonType,
                desc: seasonDesc
            })
        )
    }

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
                            value={seasonYear}
                            placeholder='yyyy' 
                            variant='outlined'
                            InputProps={{ inputProps: { min: 2000, max: 2100 } }}
                            fullWidth
                            onChange={yearChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <FormControl fullWidth>
                                <InputLabel id='type'>Season Type</InputLabel>
                                <Select 
                                required 
                                labelId='type' 
                                label="Season type"
                                value={seasonType}
                                variant='outlined'
                                onChange={typeChangeHandler}
                                >
                                    <MenuItem value={'developer'}>Developer</MenuItem>
                                    <MenuItem value={'designer'}>Designer</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='field'>
                            <TextField  
                            label='Description'
                            type='text' 
                            value={seasonDesc}
                            placeholder='Description' 
                            variant='outlined'
                            fullWidth
                            multiline='true'
                            rows='3'
                            onChange={descChangeHandler}
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
                    onClick={createNewSeason}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default HomeDialog