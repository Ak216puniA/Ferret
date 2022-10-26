import React from 'react'
import './index.css';
import { useSelector, useDispatch } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material'
import { FormControl, InputLabel, Input } from '@mui/material';
import { openCreateSeasonDialog, closeCreateSeasonDialog} from '../../features/season/seasonSlice'
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
            // sx={{
            //     backgroundImage:"#EEEEEE",
            //     color:"#EEEEEE",
            //     minHeight:"400px"
            // }}
            className='dialog'
            >
                <div className='crossDiv' onClick={() => dispatch(closeCreateSeasonDialog())}><GrClose size={12}/></div>
                <DialogTitle>Create New Recruitment Season</DialogTitle>
                <DialogContent>
                    <form id='createSeasonForm' onSubmit={() => dispatch()}>
                        <div className='fieldsDiv'>
                            <div className='field'>
                                <TextField label='Academic Year' placeholder='yyyy' variant='outlined' fullWidth/>
                            </div>
                            <div className='field'>
                                <FormControl fullWidth>
                                    <InputLabel id='type'>Season Type</InputLabel>
                                    <Select labelId='type' label="Season type" variant='outlined'>
                                        <MenuItem value={'developer'}>Developer</MenuItem>
                                        <MenuItem value={'designer'}>Designer</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    {/* <div className='createButtonDiv'>
                        <Button>Create</Button>
                    </div> */}
                    <div className='createButtonDiv'>
                        <button className='createButton' type='submit' form='createSeasonForm'>Create</button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
        )
}

export default HomepageContent

