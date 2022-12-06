import { Card, CardContent, Dialog, DialogContent, DialogTitle, Divider, FormControl, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCandidateInterviewQuestion, fetchQuestionWiseCandidateSectionMarks, fetchSelectedCandidateSectionMarks, openDeleteCofirmationDialog, resetCandidateModalState, selectSection, updateCandidateModalCandidateRoundStatus, updateCandidateRoundStatus, updatedCandidateRoundStatus, updatedCandidateSectionQuestionList } from '../../features/candidateModal/candidateModalSlice'
import { fetchQuestions } from '../../features/question/questionSlice'
import { fetchCurrentSectionsTotalMarks } from '../../features/roundTab/roundTabSlice'
import CandidateModalInterviewAddQuestion from '../candidate_modal_interview_add_question'
import CandidateModalInterviewChooseQuestion from '../candidate_modal_interview_choose_question'
import CandidateModalQuestion from '../candidate_modal_question'
import DeleteConfirmationDialog from '../delete_confirmation_dialog'
import './index.css';

function CandidateModal() {
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const closeModalHandler = (event,reason) => {
        if(reason!=='backdropClick' && reason!=='escapeKeyDown') dispatch(resetCandidateModalState())
    }

    function sectionCardClickHandler(section_id,section_name){
        dispatch(
            fetchQuestionWiseCandidateSectionMarks({
                candidate_id: candidateModalState.candidate['id'],
                section_id: section_id
            })
        )
        dispatch(selectSection({
            'section_name':section_name,
            'section_id':section_id
        }))
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

    const candidateRoundStatusChangeHandler = (event) => {
        dispatch(updateCandidateModalCandidateRoundStatus(event.target.value))
    }

    const candidateRoundStatusOptionsForSeniorYear = roundTabState.currentTabType==='test' ?
    [
        ['pending','Pending'],
        ['done','Done']
    ] :
    [
        ['pending','Pending'],
        ['not_notified','Not Notified'],
        ['notified','Notified'],
        ['waiting_room','In Waiting Room'],
        ['interview','In Interview'],
        ['done','Done']
    ]

    const candidateRoundStatusOptionsForJuniorYear = roundTabState.currentTabType==='test' ?
    [] :
    [
        ['pending','Pending'],
        ['not_notified','Not Notified'],
        ['notified','Notified'],
        ['waiting_room','In Waiting Room'],
        ['interview','In Interview']
    ]

    let sectionName = candidateModalState.section_name!=='' ? candidateModalState.section_name : 'No section selected!'

    let sectionCards = roundTabState.current_sections.length>0 ?
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

    let candidateRoundStatusMenuItems = localStorage.getItem('year')>2 ? 
    candidateRoundStatusOptionsForSeniorYear.map(status => <MenuItem key={status[0]} value={status[0]}>{status[1]}</MenuItem>) :
    candidateRoundStatusOptionsForJuniorYear.map(status => <MenuItem key={status[0]} value={status[0]}>{status[1]}</MenuItem>)

    let sectionQuestionData = candidateModalState.candidate_question_data.length>0 ?
    candidateModalState.candidate_question_data.map((question,index) => <CandidateModalQuestion key={question['id']} question={question} index={index}/>) :
    []

    let addNewQuestionOption = (candidateModalState.section_name!=='' && roundTabState.currentTabType==='interview') ? 
    <>
    <CandidateModalInterviewAddQuestion />
    <CandidateModalInterviewChooseQuestion />
    </> : 
    <></>

    const yearWiseSectionCards = localStorage.getItem('year')>2 ?
    <div className='candidateModalContentDiv'>
        {sectionCards}
    </div> :
    <></>

    const yearWiseCandidateRoundStatus = localStorage.getItem('year')<3 && roundTabState.currentTabType=='test' ?
    <></> :
    <div className='candidateModalContentStatusDiv'>
        <div className='candidateModalStatusHeading'>
            Status: 
        </div>
        <div className='candidateModalStatusOptionsDiv'>
        <FormControl fullWidth>
            <Select 
            required
            value={candidateModalState.candidateRoundStatus}
            placeholder='Filtering criteria' 
            variant='outlined'
            onChange={candidateRoundStatusChangeHandler}
            >
                {candidateRoundStatusMenuItems}
            </Select>
        </FormControl>
        </div>
    </div>

    const yearWiseSectionDesc = localStorage.getItem('year')>2 ?
    <div className='candidateModalSectionDescDiv'>
        <div className='candidateModalHeading1'>{sectionName}</div>
        {sectionQuestionData}
        {addNewQuestionOption}
    </div> :
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
        if(candidateModalState.candidateRoundStatusModified===true){
            dispatch(
                updateCandidateRoundStatus({
                    candidateRoundId: candidateModalState.candidateRoundId,
                    candidateRoundStatus: candidateModalState.candidateRoundStatus
                })
            )
            dispatch(updatedCandidateRoundStatus())
        }
    },[candidateModalState.interviewQuestionsChanged, candidateModalState.candidateRoundStatusModified])

    return (
        <>
        <Dialog
        open={candidateModalState.open_candidate_modal}
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
                    <div className='dialogTitleText'>{candidateModalState.candidate['name']}</div>
                    <div className='dialogTitleText'>{candidateModalState.candidate['enrollment_no']}</div>
                </Box>
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
                    {yearWiseSectionCards}
                    {yearWiseCandidateRoundStatus}
                    <Divider 
                    style={{
                        width:'100%', 
                        backgroundColor: '#00BCC5',
                        margin: '8px 0px'
                    }}
                    />
                    {yearWiseSectionDesc}
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

export default CandidateModal