import { Card, CardActionArea, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCandidate, fetchQuestionWiseCandidateSectionMarks, openCandidateModal, selectSection } from '../../features/candidateModal/candidateModalSlice'
import './index.css';

function CandidateModal() {
    const candidateModalState = useSelector((state) => state.candidateModal)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    const closeModalHandler = () => {
        dispatch(
            openCandidateModal({
                open: false,
                candidate_id: 0
            })
        )
    }

    function sectionCardClickHandler(section_id,section_name){
        dispatch(
            fetchQuestionWiseCandidateSectionMarks({
                candidate_id: candidateModalState.candidate['id'],
                section_id: section_id
            })
        )
        dispatch(selectSection(section_name))
    }

    let sectionCards = roundTabState.current_sections.length>0 ?
    roundTabState.current_sections.map((section,index) => {
        return (
            <div onClick={() => sectionCardClickHandler(section['id'],section['name'])}>
                <Card 
                key={section['id']}
                sx={{
                    minWidth: "160px",
                    margin: '4px 8px'
                }}
                >
                    <CardContent>
                        <div className='candidateModalHeading2'>{section['name']}</div>
                        <div className='candidateModalTextFaded'>weightage : {section['weightage']}</div>
                        <div className='candidateModalHeading3'>{candidateModalState.candidate_section_marks[index+1]} / {roundTabState.current_sections_total_marks[index]}</div>
                    </CardContent>
                </Card>
            </div>
        )
    }) :
    []

    let sectionName = candidateModalState.section_name!='' ? candidateModalState.section_name : 'No section selected!'


    let sectionQuestionData = candidateModalState.candidate_question_data.length>0 ?
    candidateModalState.candidate_question_data.map((question,index) => {
        return (
            <div className='candidateModalColumnFlex candidateModalQuestionDiv'>
                <div className='candidateModalRowFlex'>
                    <div>Q.{index+1}</div>
                    <div>({question['question']['assignee']} : {question['status']})</div>
                </div>
                <div className='candidateModalColumnFlex'>
                    <div className='candidateModalQuestionText'>{question['question']['text']}</div>
                    <div className='candidateModalQuestionMarks'>{question['marks']}/{question['question']['marks']}</div>
                </div>
                <div className='candidateModalColumnFlex'>
                    <div>Remarks:</div>
                    <div className='candidateModalQuestionRemark'>{question['remarks']}</div>
                </div>
            </div>
        )
    }) :
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
        open={candidateModalState.open_candidate_modal}
        onClose={closeModalHandler}
        className='candidateModal'
        PaperProps={{ sx: { width: "60%" } }}
        >
            <div className='crossDiv' onClick={closeModalHandler}><GrClose size={12}/></div>
            <DialogTitle>
                <Box
                sx={flexBoxRow}
                >
                    <div>{candidateModalState.candidate['name']}</div>
                    <div>{candidateModalState.candidate['enrollment_no']}</div>
                </Box>
            </DialogTitle>
            <Divider />
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
                    <Divider style={{width:'100%', height:'12px'}}/>
                    <div className='candidateModalSectionDescDiv'>
                        <div className='candidateModalHeading1'>{sectionName}</div>
                        {sectionQuestionData}
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateModal