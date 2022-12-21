import { Card, CardContent, Dialog, DialogContent, DialogTitle, Divider, FormControl, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCandidateInterviewQuestion, fetchCandidate, fetchQuestionWiseCandidateSectionMarks, fetchSelectedCandidateSectionMarks, openCandidateModal, openDeleteCofirmationDialog, resetCandidateModalState, selectSection, updatedCandidateSectionQuestionList } from '../../features/candidateModal/candidateModalSlice'
import { fetchCandidateRoundsInfo, openInterviewModal, updateInInterviewCandidateOptions } from '../../features/interviewPanel/interviewPanelSlice'
import { fetchQuestions } from '../../features/question/questionSlice'
import { fetchCurrentSectionsTotalMarks, fetchSections, resetRoundTabState } from '../../features/roundTab/roundTabSlice'
import CandidateModalInterviewAddQuestion from '../candidate_modal_interview_add_question'
import CandidateModalInterviewChooseQuestion from '../candidate_modal_interview_choose_question'
import CandidateModalQuestion from '../candidate_modal_question'
import DeleteConfirmationDialog from '../delete_confirmation_dialog'

function InterviewModal(props) {
    const { seasonId } = props
    const interviewPanelState = useSelector((state) => state.interviewPanel)
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const [panelCandidate, setPanelCandidate] = useState('')
    const [panelRound, setPanelRound] = useState('')
    const [candidateSet, setCandidateSet] = useState(false)

    const panelCandidateChangeHandler = (event) => {
        setPanelCandidate(event.target.value)
        dispatch(
            openCandidateModal({
                open: false,
                candidate_id: event.target.value['candidate_id']['id'],
                candidateRoundId: event.target.value['id'],
                candidateRoundStatus: event.target.value['status']
            })
        )
        dispatch(fetchCandidate(event.target.value['candidate_id']['id']))
        dispatch(
            fetchSelectedCandidateSectionMarks({
                candidate_list: [event.target.value['candidate_id']['id']],
                section_list: roundTabState.current_sections.map((section) => section['id'])
            })
        )
        dispatch(
            fetchCurrentSectionsTotalMarks({
                candidateId: event.target.value['candidate_id']['id'],
                sectionList: roundTabState.current_sections.map((section) => section['id'])
            })
        )
        dispatch(
            fetchCandidateRoundsInfo({
                candidateId: event.target.value['candidate_id']['id'],
                seasonId: seasonId
            })
        )
        setCandidateSet(true)
    }

    const panelRoundChangeHandler = (event) => {
        setPanelRound(event.target.value)
        dispatch(
            updateInInterviewCandidateOptions({
                roundId: event.target.value,
                interviewPanelId: interviewPanelState.panel['id']
            })
        )
        dispatch(fetchSections(event.target.value))
        dispatch(resetCandidateModalState())
        setPanelCandidate('')
        setCandidateSet(false)
    }

    const closeModalHandler = (event,reason) => {
        if(reason!=='backdropClick' && reason!=='escapeKeyDown') {
            dispatch(resetCandidateModalState())
            dispatch(resetRoundTabState())
            dispatch(
                openInterviewModal({
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
            setCandidateSet(false)
        }
    }

    function sectionCardClickHandler(section_id,section_name){
        dispatch(
            fetchQuestionWiseCandidateSectionMarks({
                candidate_id: candidateModalState.candidate['id'],
                section_id: section_id
            })
        )
        dispatch(
            selectSection({
                'section_name':section_name,
                'section_id':section_id
            })
        )
        dispatch(
            fetchSelectedCandidateSectionMarks({
                candidate_list: [candidateModalState.candidate_id],
                section_list: roundTabState.current_sections.map(section => section['id'])
            })
        )
        dispatch(fetchQuestions(section_id))
    }

    const dialogCloseHandler = () => {
        dispatch(openDeleteCofirmationDialog(false))
    }

    const agreeActionClickHandler = () => {
        dispatch(
            deleteCandidateInterviewQuestion({
                candidateMarksId: candidateModalState.deleteQuestionId
            })
        )
    }

    let interviewPanelRoundMenuItems = interviewPanelState.panelRoundList.length>0 ?
    interviewPanelState.panelRoundList.map(round => {
        if(round['type']==='interview') return <MenuItem key={round['id']} value={round['id']}>{round['name']}</MenuItem>
    }) :
    []

    let interviewPanelCandidateMenuItems = interviewPanelState.panelCandidateList.length>0 ?
    interviewPanelState.panelCandidateList.map(candidateRound => <MenuItem key={candidateRound['id']} value={candidateRound}>{candidateRound['candidate_id']['name']}</MenuItem>) :
    []

    let sectionName = candidateSet ? (candidateModalState.section_name!=='' ? candidateModalState.section_name : 'No section selected!') : ''

    let sectionCards = roundTabState.current_sections.length>0 && candidateSet ?
    roundTabState.current_sections.map((section,index) => {
        return (
            <div key={section['id']} onClick={() => sectionCardClickHandler(section['id'],section['name'])}>
                <Card 
                key={section['id']}
                sx={{
                    minWidth: "10em",
                    margin: '4px 8px',
                    backgroundColor: '#F5B041',
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
                        <div className='candidateModalCard'>
                            <div className='candidateModalHeading2'>{section['name']}</div>
                            <div className='candidateModalTextFaded'>weightage : {section['weightage']}</div>
                            <div className='candidateModalHeading3'>{candidateModalState.candidate_section_marks[index+1]} / {roundTabState.current_sections_total_marks[index]}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }) :
    []

    let sectionQuestionData = candidateModalState.candidate_question_data.length>0 ?
    candidateModalState.candidate_question_data.map((question,index) => <CandidateModalQuestion key={question['id']} question={question} index={index}/>) :
    []

    let addNewQuestionOption = candidateModalState.section_name!=='' && candidateSet? 
    <>
    <CandidateModalInterviewAddQuestion />
    <CandidateModalInterviewChooseQuestion />
    </> : 
    <></>

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

    useEffect(() => {
        if(candidateModalState.interviewQuestionsChanged===true){
            dispatch(
                fetchQuestionWiseCandidateSectionMarks({
                    candidate_id: candidateModalState.candidate['id'],
                    section_id: candidateModalState.section_id
                })
            )
            dispatch(updatedCandidateSectionQuestionList())
            dispatch(
                fetchCurrentSectionsTotalMarks({
                    candidateId: candidateModalState.candidate['id'],
                    sectionList: roundTabState.current_sections.map(section => section['id'])
                })
            )
        }
    },[candidateModalState.interviewQuestionsChanged])

    return (
        <>
        <Dialog
        open={interviewPanelState.openInterviewModal}
        onClose={closeModalHandler}
        PaperProps={{ sx: { width: "80%", backgroundColor: '#EEEEEE' } }}
        fullWidth
        maxWidth='100%'
        >
            <div className='crossDiv' onClick={closeModalHandler}><GrClose size={12}/></div>
            <DialogTitle>
                <Box
                sx={flexBoxRow}
                >
                    <div className='dialogTitleText'>{interviewPanelState.panel['location']}</div>
                    <div className='dialogTitleText'>{interviewPanelState.panel['panel_name']}</div>
                </Box>
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
                    <div className='candidateModalContentDiv'>
                        <div className='candidateModalInnerInfoDivData'>
                            <div className='candidateModalInfoHeading'>Email:</div>
                            <div className='candidateModalInfoData'>{candidateModalState.candidate['email']}</div>
                        </div>
                        <div className='candidateModalInnerInfoDivData'>
                            <div className='candidateModalInfoHeading'>Year:</div>
                            <div className='candidateModalInfoData'>{candidateModalState.candidate['year']}</div>
                        </div>
                        <div className='candidateModalInnerInfoDivData'>
                            <div className='candidateModalInfoHeading'>Contact No.:</div>
                            <div className='candidateModalInfoData'>{candidateModalState.candidate['mobile_no']}</div>
                        </div>
                        <div className='candidateModalInnerInfoDivData'>
                            <div className='candidateModalInfoHeading'>CG:</div>
                            <div className='candidateModalInfoData'>{candidateModalState.candidate['cg']}</div>
                        </div>
                    </div>
                    <div className='candidateModalContentDiv'>
                        {sectionCards}
                    </div>
                    <Divider 
                    style={{
                        width:'100%', 
                        backgroundColor: '#00BCC5',
                        margin: '8px 0px'
                    }}
                    />
                    <div className='candidateModalSectionDescDiv'>
                        <div className='candidateModalHeading1'>{sectionName}</div>
                        {sectionQuestionData}
                        {addNewQuestionOption}
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
        <DeleteConfirmationDialog
        open={candidateModalState.openDeleteDialog} 
        dialogCloseHandler={dialogCloseHandler} 
        agreeActionClickHandler={agreeActionClickHandler}
        />
        </>
    )
}

export default InterviewModal