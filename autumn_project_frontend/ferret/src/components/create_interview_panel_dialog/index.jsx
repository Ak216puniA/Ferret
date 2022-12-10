import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { createInterviewPanel, openCreateInterviewPanelDialog } from '../../features/interviewPanel/interviewPanelSlice'

function CreateInterviewPanelDialog(props) {
    const { seasonId } = props
    const userState = useSelector((state) => state.user)
    const interviewPanelState = useSelector((state) => state.interviewPanel.openCreatePanelDialog)
    const dispatch = useDispatch()

    const [panelName, setPanelName] = useState('')
    const [panelLocation, setPanelLocation] = useState('')
    const [panelPanelists, setPanelPanelists] = useState([])

    const panelNameChangeHandler = (event) => {
        setPanelName(event.target.value)
    }

    const panelLocationChangeHandler = (event) => {
        setPanelLocation(event.target.value)
    }

    const panelPanelistsChangeHandler = (event) => {
        setPanelPanelists(event.target.value)
    }

    const createNewInterviewPanel = () => {
        alert("hello")
        dispatch(
            createInterviewPanel({
                seasonId: seasonId,
                panelName: panelName,
                panelist: panelPanelists,
                location: panelLocation
            })
        )
    }

    const panelistsList = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']} >{user['name']}</MenuItem>) :
    []

    return (
        <Dialog
        open={interviewPanelState}
        onClose={() => dispatch(openCreateInterviewPanelDialog(false))}
        className='dialog'
        PaperProps={{ sx: { width: "40%" } }}
        >
            <div className='crossDiv' onClick={() => dispatch(openCreateInterviewPanelDialog(false))}><GrClose size={12}/></div>
            <DialogTitle
            sx={{
                display: 'flex',
                justifyContent: 'center'
            }}
            >
                Create Interview Panel
            </DialogTitle>
            <DialogContent>
            <form id='createPanelForm' onSubmit={() => dispatch()}>
                    <div className='fieldsDiv'>
                        <div className='field'>
                            <TextField
                            required 
                            label='Panel Name' 
                            type='text' 
                            placeholder='Name' 
                            variant='outlined'
                            fullWidth
                            value={panelName}
                            onChange={panelNameChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <TextField 
                            required 
                            label='Location' 
                            type='text' 
                            placeholder='Location' 
                            variant='outlined'
                            fullWidth
                            value={panelLocation}
                            onChange={panelLocationChangeHandler}
                            />
                        </div>
                        <div className='field'>
                            <FormControl fullWidth>
                                <InputLabel id='panelists'>Panelists</InputLabel>
                                <Select 
                                required 
                                labelId='panelists' 
                                label="Panelists" 
                                variant='outlined'
                                value={panelPanelists}
                                multiple
                                onChange={panelPanelistsChangeHandler}
                                >
                                    {panelistsList}
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
                    form='createPanelForm'
                    onClick={createNewInterviewPanel}
                    >
                        Create
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default CreateInterviewPanelDialog