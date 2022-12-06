import { Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openInterviewDialog } from '../../features/interviewPanel/interviewPanelSlice'
import InterviewModal from '../interview_modal'
import './index.css'

function PanelCard(props) {
    const { panel } = props
    const dispatch = useDispatch()

    const panelCardClickHandler = () => {
        console.log(panel['id'])
        dispatch(
            openInterviewDialog({
                open: true,
                panel: panel
            })
        )
    }

    const panelists = panel['panelist'].length>0 ?
    panel['panelist'].map(panelist => <div key={panelist['id']} className='panelPanelist'>{panelist['name']}</div>) :
    <></>

    return (
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
    )
}

function PanelPageContent(props) {
    const { seasonId } = props
    const interviewPanelState = useSelector((state) => state.interviewPanel)

    const panelCards = interviewPanelState.panelList.length>0 ?
    interviewPanelState.panelList.map((panel) => <PanelCard key={panel['id']} panel={panel}/>) :
    <></>

    const interviewModal = seasonId>0 ? <InterviewModal /> : <></>

    return (
        <div className='panelPageContentDiv'>
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className='panelCardsDiv'>
                {panelCards}
            </div>
            {interviewModal}
        </div>
    )
}

export default PanelPageContent