import { Card, CardContent } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { deleteInterviewPanel, fetchInterviewPanels, openAssignInterviewPanelModal, openInterviewModal, openInterviewPanelDeleteConfirmationDialog } from '../../features/interviewPanel/interviewPanelSlice'
import AssignInterviewPanelModal from '../assign_interview_panel_modal'
import CreateInterviewPanelDialog from '../create_interview_panel_dialog'
import DeleteConfirmationDialog from '../delete_confirmation_dialog'
import InterviewModal from '../interview_modal'
import './index.css'

function PanelCard(props) {
    const { panel, seasonId } = props
    const dispatch = useDispatch()

    const panelCardClickHandler = () => {
        if(seasonId>0){
            if(localStorage.getItem('year')>2){
                console.log("Open interview candidate round model...")
                dispatch(
                    openInterviewModal({
                        open: true,
                        panel: panel
                    })
                )
            }else{
                dispatch(
                    openAssignInterviewPanelModal({
                        open: true,
                        panel: panel
                    })
                )
            }
        }
    }

    const openCandidateAssignmentDialogHandler = () => {
        dispatch(
            openAssignInterviewPanelModal({
                open: true,
                panel: panel
            })
        )
    }

    const deleteInterviewPanelClickHandler = () => {
        dispatch(
            openInterviewPanelDeleteConfirmationDialog({
                open: true,
                panelId: panel['id']
            })
        )
    }

    const panelists = panel['panelist'].length>0 ?
    panel['panelist'].map(panelist => <div key={panelist['id']} className='panelPanelist'>{panelist['name']}</div>) :
    <></>

    const interviewPanelAssignButton = seasonId>0 && localStorage.getItem('year')>2 ?
    <button className='panelCardAssignButton' onClick={openCandidateAssignmentDialogHandler}>Assign</button> :
    <></>

    const deleteInterviewPanelButton = seasonId>0 && localStorage.getItem('year')>2 ? 
    <div className='interviewPanelDeleteIconDiv' onClick={deleteInterviewPanelClickHandler}><MdDelete color='#C0392B' size={20} /></div> :
    <></>

    return (
        <div className='panelCardOuterDiv'>
        <div onClick={panelCardClickHandler} className="panelCardDiv">
            <Card
            raised={true}
            sx={{
                minHeight: '100%',
                backgroundColor: '#F5B041',
                padding: "0px 8px",
                '&:hover': {
                    backgroundColor: '#F7A624',
                }
            }}
            >
                <CardContent
                sx={{
                    padding: '12px 0px'
                }}
                >
                    <div className='panelCard'>
                        <div className='panelStatus'>{`[ ${panel['status'].toUpperCase()} ]`}</div>
                        <div className='panelName'>{panel['panel_name']}</div>
                        <div className='panelLocation'>{panel['location']}</div>
                        <div className='panelPanelistsDiv'>{panelists}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
        {interviewPanelAssignButton}
        {deleteInterviewPanelButton}
        </div>
    )
}

function InterviewPanelsContent(props) {
    const { seasonId, wsInterviewPanels } = props
    const interviewPanelState = useSelector((state) => state.interviewPanel)
    const dispatch = useDispatch()

    const deletedialogCloseHandler = () => {
        dispatch(
            openInterviewPanelDeleteConfirmationDialog({
                open: false,
                panelId: 0
            })
        )
    }

    const deleteagreeActionClickHandler = () => {
        dispatch(
            deleteInterviewPanel(interviewPanelState.deletePanelId)
        )
        dispatch(
            fetchInterviewPanels(seasonId)
        )
    }

    const panelCards = interviewPanelState.panelList.length>0 ?
    interviewPanelState.panelList.map((panel) => <PanelCard key={panel['id']} panel={panel} seasonId={seasonId}/>) :
    <></>

    useEffect(() => {
        document.getElementById("interviewPanelsDownArrow").style.display = 'block'
    },[])

    return (
        <div className='panelPageContentDiv'>
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className='panelCardsDiv'>
                {panelCards}
            </div>
            <AssignInterviewPanelModal wsInterviewPanels={wsInterviewPanels} />
            <InterviewModal />
            <CreateInterviewPanelDialog seasonId={seasonId} />
            <DeleteConfirmationDialog
            open={interviewPanelState.openDeleteDialog}
            dialogCloseHandler={deletedialogCloseHandler}
            agreeActionClickHandler={deleteagreeActionClickHandler}
            />
        </div>
    )
}

export default InterviewPanelsContent