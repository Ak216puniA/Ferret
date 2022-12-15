import { Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { openAssignInterviewPanelModal, updateCandidateRoundInterviewPanel, updateInterviewPanelStatus, updatePanelCandidateOptions } from '../../features/interviewPanel/interviewPanelSlice'
import './index.css'

function AssignInterviewPanelModal(props) {
    const { wsInterviewPanels } = props
    const interviewPanelState = useSelector((state) => state.interviewPanel)
    const dispatch = useDispatch()

    const [panelCandidate, setPanelCandidate] = useState('')
    const [panelRound, setPanelRound] = useState('')

    const panelCandidateChangeHandler = (event) => {
        setPanelCandidate(event.target.value)
    }

    const panelRoundChangeHandler = (event) => {
        setPanelRound(event.target.value)
        dispatch(
            updatePanelCandidateOptions({
                roundId: event.target.value
            })
        )
    }

    const interviewDialogCloseHandler = (event,reason) => {
        if (reason!=='backdropClick' && reason!=='escapeKeyDown'){
            dispatch(
                openAssignInterviewPanelModal({
                    open: false,
                    panel: {
                        'id': 0,
                        'season_id': 0,
                        'panel_name': '',
                        'panelist': [],
                        'location': '',
                        'status': ''
                    }
                })
            )
            setPanelCandidate('')
            setPanelRound('')
        }
    }

    const interviewPanelStatusChangeHandler = (event) => {
        wsInterviewPanels.current.send(
            JSON.stringify({
                panel_id: interviewPanelState.panel['id'],
                status: event.target.value
            })
        )
    }

    const assignCandidateToInterviewPanel = () => {
        if(panelCandidate>0){
            dispatch(
                updateCandidateRoundInterviewPanel({
                    candidateRoundId: panelCandidate,
                    interviewPanelId: interviewPanelState.panel['id']
                })
            )
            dispatch(
                openAssignInterviewPanelModal({
                    open: false,
                    panel: {
                        'id': 0,
                        'season_id': 0,
                        'panel_name': '',
                        'panelist': [],
                        'location': '',
                        'status': ''
                    }
                })
            )
            setPanelCandidate(0)
            setPanelRound(0)
        }else{
            alert('Candidate is a required field!')
        }
    }

    const interviewPanelStatusOptions = [
        ['inactive','Inactive'],
        ['occupied','Occupied'],
        ['idle','Idle'],
        ['on_break','On Break']
    ]

    const interviewPanelists = interviewPanelState.panel['panelist'].length>0 ?
    interviewPanelState.panel['panelist'].map(panelist => <div key={panelist['id']} className='interviewModalPanelist'>{panelist['name']}</div>) :
    <></>

    const interviewPanelStatusMenuItems = interviewPanelStatusOptions.map(status => <MenuItem key={status[0]} value={status[0]}>{status[1]}</MenuItem>)

    let interviewPanelRoundMenuItems = interviewPanelState.panelRoundList.length>0 ?
    interviewPanelState.panelRoundList.map(round => {
        if(round['type']==='interview') return <MenuItem key={round['id']} value={round['id']}>{round['name']}</MenuItem>
    }) :
    []

    let interviewPanelCandidateMenuItems = interviewPanelState.panelCandidateList.length>0 ?
    interviewPanelState.panelCandidateList.map(candidateRound => <MenuItem key={candidateRound['id']} value={candidateRound['id']}>{candidateRound['candidate_id']['name']}</MenuItem>) :
    []

    const flexBoxRow = {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:'8px',
        marginBottom:'4px'
    }

    const flexBoxColumn = {
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    }

    return (
        <Dialog
        open={interviewPanelState.openAssignModal}
        onClose={interviewDialogCloseHandler}
        PaperProps={{ sx: { width: "80%", backgroundColor: '#EEEEEE' } }}
        fullWidth
        maxWidth='100%'
        >
            <div className='crossDiv' onClick={interviewDialogCloseHandler}><GrClose size={12}/></div>
            <DialogTitle>
                <Box
                sx={flexBoxRow}
                >
                    <div className='dialogTitleText'>{interviewPanelState.panel['location']}</div>
                    <div className='dialogTitleText'>{interviewPanelState.panel['panel_name']}</div>
                </Box>
                <div className='interviewModalPanelistsDiv'>{interviewPanelists}</div>
                <div className='candidateModalContentStatusDiv'>
                    <div className='candidateModalStatusHeading'>
                        Status: 
                    </div>
                    <div className='candidateModalStatusOptionsDiv'>
                    <FormControl fullWidth>
                        <Select 
                        required
                        value={interviewPanelState.panel['status']}
                        placeholder='Status' 
                        variant='outlined'
                        onChange={interviewPanelStatusChangeHandler}
                        >
                            {interviewPanelStatusMenuItems}
                        </Select>
                    </FormControl>
                    </div>
                </div>
            </DialogTitle>
            <Divider 
            style={{
                backgroundColor: '#00BCC5',
                width: '100%',
            }}
            />
            <DialogContent>
                <Box
                sx={flexBoxColumn}
                >
                    <div className='interviewDialogContentDiv'>
                        <div className='interviewDialogContentFieldDiv'>
                            <div className='interviewDialogContentFieldName'>
                                Round: 
                            </div>
                            <div className='interviewDialogContentFieldOptions'>
                            <FormControl fullWidth>
                                <Select 
                                required
                                value={panelRound}
                                placeholder='Interview Round' 
                                variant='outlined'
                                onChange={panelRoundChangeHandler}
                                >
                                    {interviewPanelRoundMenuItems}
                                </Select>
                            </FormControl>
                            </div>
                        </div>
                        <div className='interviewDialogContentFieldDiv'>
                            <div className='interviewDialogContentFieldName'>
                                Candidate: 
                            </div>
                            <div className='interviewDialogContentFieldOptions'>
                            <FormControl fullWidth>
                                <Select 
                                required
                                value={panelCandidate}
                                placeholder='Candidate' 
                                variant='outlined'
                                onChange={panelCandidateChangeHandler}
                                >
                                    {interviewPanelCandidateMenuItems}
                                </Select>
                            </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className='interviewModalAssignButtonDiv'>
                        <button className='interviewModalAssignButton' onClick={assignCandidateToInterviewPanel}>Assign</button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AssignInterviewPanelModal