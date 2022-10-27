import React from 'react'
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material'
import { FormControl, InputLabel, Input } from '@mui/material';
import { openCreateSeasonDialog, closeCreateSeasonDialog, handleChangeNewYear, handleChangeNewType, createSeason} from '../../features/season/seasonSlice'
import { GrClose } from "react-icons/gr";

function SeasonTableRow(props){
    const {season, index} = props
    return (
        <div className='seasonRow'>
            <div className={`seasonIndex singleElementRowFlex`}>{index}</div>
            <div className={`seasonName  singleElementRowFlex`}>{`Recruitment season ${season.name}`}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.start}</div>
            <div className={`seasonStartEnd  singleElementRowFlex`}>{season.end}</div>
        </div>
    )
}

function HomepageContent(props){
        const {contentHeading} = props

        const seasonState = useSelector((state) => state.season)
        const dispatch = useDispatch()

        const seasonTableHeading = {
            name : 'Recruitment Season',
            start : 'Start Date',
            end : 'End Date'
        }

        const seasons = seasonState.data
        let seasonTable = (
            seasons.length>0 ? 
            seasons.map((season, index) => <SeasonTableRow key={season.name} season={season} index={index+1}/>) : 
            <div></div>
        )

        // const new_year = 0

        return (
        <div className='homepageContent'>
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className='contentDiv'>
                <div className='contentHeading'>{contentHeading}</div>
                <div>
                    <div className='seasonHeadingRow'>
                        <div className={`seasonIndex singleElementRowFlex`}>S.No.</div>
                        <div className={`seasonName  singleElementRowFlex`}>{seasonTableHeading.name}</div>
                        <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.start}</div>
                        <div className={`seasonStartEnd  singleElementRowFlex`}>{seasonTableHeading.end}</div>
                    </div>
                    {seasonTable}
                </div>
            </div>
            <div className='createSeasonButtonDiv'>
                <button className='createSeasonButton' onClick={() => dispatch(openCreateSeasonDialog())}>Create Season</button>
            </div>
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
                                    defaultValue={seasonState.season_type}
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
        </div>
        )
}

export default HomepageContent

