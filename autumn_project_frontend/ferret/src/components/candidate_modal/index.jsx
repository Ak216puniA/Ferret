import { Card, CardContent, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCandidateInterviewQuestion, fetchCandidate, fetchQuestionWiseCandidateSectionMarks, fetchSelectedCandidateSectionMarks, openDeleteCofirmationDialog, resetCandidateModalState, selectSection, updatedCandidateSectionQuestionList } from '../../features/candidateModal/candidateModalSlice'
import { fetchQuestions } from '../../features/question/questionSlice'
import CandidateModalInterviewAddQuestion from '../candidate_modal_interview_add_question'
import CandidateModalInterviewChooseQuestion from '../candidate_modal_interview_choose_question'
import CandidateModalQuestion from '../candidate_modal_question'
import DeleteConfirmationDialog from '../delete_confirmation_dialog'
import './index.css';

function CandidateModal() {
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const closeModalHandler = () => {
        dispatch(resetCandidateModalState())
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

    let sectionName = candidateModalState.section_name!=='' ? candidateModalState.section_name : 'No section selected!'


    let sectionQuestionData = candidateModalState.candidate_question_data.length>0 ?
    candidateModalState.candidate_question_data.map((question,index) => <CandidateModalQuestion key={question['id']} question={question} index={index}/>) :
    []

    let addNewQuestionOption = (candidateModalState.section_name!=='' && roundTabState.currentTabType==='interview') ? 
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
        }
    },[candidateModalState.interviewQuestionsChanged])

    return (
        <>
        <Dialog
        open={candidateModalState.open_candidate_modal}
        onClose={closeModalHandler}
        className='candidateModal'
        PaperProps={{ sx: { width: "60%", backgroundColor: '#EEEEEE' } }}
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

export default CandidateModal