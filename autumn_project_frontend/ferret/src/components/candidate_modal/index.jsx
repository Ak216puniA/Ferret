import { Card, CardContent, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuestionWiseCandidateSectionMarks, fetchSelectedCandidateSectionMarks, resetCandidateModalState, selectSection, updatedCandidateSectionQuestionList } from '../../features/candidateModal/candidateModalSlice'
import CandidateModalInterviewAddQuestion from '../candidate_modal_interview_add_question'
import CandidateModalQuestion from '../candidate_modal_question'
import './index.css';

// function InterviewSectionAddQuestion() {
//     const candidateModalState = useSelector((state) => state.candidateModal)
//     const dispatch = useDispatch()

//     const [questionText, setQuestionText] = useState('')
//     const [questionTotalMarks, setQuestionTotalMarks] = useState(0)
//     const [questionMarks, setQuestionMarks] = useState(0)
//     const [questionRemarks, setQuestionRemarks] = useState('')

//     const questionTextChangeHandler = (event) => {
//         setQuestionText(event.target.value)
//     }

//     const questionMarksChangeHandler = (event) => {
//         setQuestionMarks(event.target.value)
//     }

//     const questionTotalMarksChangeHandler = (event) => {
//         setQuestionTotalMarks(event.target.value)
//     }

//     const questionRemarksChangeHandler = (event) => {
//         setQuestionRemarks(event.target.value)
//     }

//     const createInterviewQuestion = () => {
//         if(questionText!==''){
//             dispatch(
//                 createCandidateInterviewQuestion({
//                     candidate_id: candidateModalState.candidate_id,
//                     section_id: candidateModalState.section_id,
//                     questionText: questionText,
//                     questionMarks: questionMarks,
//                     questionTotalMarks: questionTotalMarks,
//                     questionRemarks: questionRemarks
//                 })
//             )
//             setQuestionMarks(0)
//             setQuestionRemarks('')
//             setQuestionText('')
//             setQuestionTotalMarks(0)
//         }else{
//             alert("Question text is a required field!")
//         }
//     }

//     return (
//         <>
//         <div className='candidateModalColumnFlex candidateModalQuestionDiv'>
//             <div className='candidateModalRowFlex'>
//                 <div className='candidateModalQuestionNo'>Q.</div>
//             </div>
//             <div className='candidateModalColumnFlex'>
//                 <div className='candidateModalQuestionText'>
//                     <TextField 
//                     type='text' 
//                     value={questionText}
//                     variant='outlined'
//                     fullWidth
//                     multiline={true}
//                     rows='2'
//                     onChange={questionTextChangeHandler}
//                     sx={{
//                         width: '100%',
//                         fontSize: '14px',
//                         margin: '4px 0px'
//                     }}
//                     />
//                 </div>
//                 <div className='candidateModalQuestionMarks'>
//                     <TextField 
//                     type='number' 
//                     value={questionMarks}
//                     variant='outlined'
//                     onChange={questionMarksChangeHandler}
//                     size='small'
//                     sx={{
//                         justifyContent:"flex-end",
//                         width: '64px',
//                         padding: '8px 0px',
//                         display: 'flex',
//                         marginRight: '8px'
//                     }}
//                     />
//                     /
//                     <TextField 
//                     type='number' 
//                     value={questionTotalMarks}
//                     variant='outlined'
//                     onChange={questionTotalMarksChangeHandler}
//                     size='small'
//                     sx={{
//                         justifyContent:"flex-end",
//                         width: '64px',
//                         padding: '8px 0px',
//                         display: 'flex',
//                         marginRight: '8px'
//                     }}
//                     />
//                 </div>
//             </div>
//             <div className='candidateModalColumnFlex'>
//                 <div>Remarks:</div>
//                 <TextField 
//                 type='text' 
//                 value={questionRemarks}
//                 variant='outlined'
//                 fullWidth
//                 multiline={true}
//                 rows='2'
//                 onChange={questionRemarksChangeHandler}
//                 sx={{
//                     width: '100%',
//                     fontSize: '14px',
//                     margin: '4px 0px'
//                 }}
//                 />
//             </div>
//             <div className='candidateModalColumnFlex2'>
//                 <div className='candidateModalCheckButtonDiv'>
//                     <button className='candidateModalCheckButton' onClick={createInterviewQuestion}><IoMdDoneAll className='tickIcon' size={20}/></button>
//                 </div>
//             </div>
//         </div>
//         <Divider 
//         style={{
//             width:'100%', 
//             backgroundColor: '#F5B041',
//             marginTop: '4px',
//             marginBottom: '12px'
//         }}
//         />
//         </>
//     )
// }

// function CandidateModalQuestion(props) {
//     const {question,index} = props
//     const candidateModalState = useSelector((state) => state.candidateModal)
//     const roundTabState = useSelector((state) => state.roundTab)
//     const dispatch = useDispatch()

//     const [questionMarks, setQuestionMarks] = useState()
//     const [questionRemarks, setQuestionRemarks] = useState()

//     const remarkChangeHandler = (event) => {
//         setQuestionRemarks(event.target.value)
//     }

//     const marksChangeHandler = (event) => {
//         setQuestionMarks(event.target.value)
//         dispatch(
//             updateCandidateQuestionMarks({
//                 id: question['id'],
//                 marks: event.target.value
//             })
//         )
//         dispatch(
//             fetchSelectedCandidateSectionMarks({
//                 candidate_list: [candidateModalState.candidate_id],
//                 section_list: roundTabState.current_sections.map(section => section['id'])
//             })
//         )
//     }

//     const markQuestionChecked = () => {
//         dispatch(
//             updateCandidateQuestionStatus({
//                 id: question['id'],
//                 remarks: questionRemarks
//             })
//         )
//     }

//     useEffect(() => {
//         setQuestionMarks(question['marks'])
//         setQuestionRemarks(question['remarks']==='' ? '' : question['remarks'])
//     },[])

//     return (
//         <>
//         <div className='candidateModalColumnFlex candidateModalQuestionDiv'>
//             <div className='candidateModalRowFlex'>
//                 <div className='candidateModalQuestionNo'>Q.{index+1}</div>
//                 <div>({question['assignee']['username']})</div>
//             </div>
//             <div className='candidateModalColumnFlex'>
//                 <div className='candidateModalQuestionText'>{question['question']['text']}</div>
//                 <div className='candidateModalQuestionMarks'>
//                     <TextField 
//                     type='number' 
//                     value={questionMarks}
//                     variant='outlined'
//                     onChange={marksChangeHandler}
//                     size='small'
//                     sx={{
//                         justifyContent:"flex-end",
//                         width: '64px',
//                         padding: '8px 0px',
//                         display: 'flex',
//                         marginRight: '8px'
//                     }}
//                     />
//                     /{question['question']['marks']}
//                 </div>
//             </div>
//             <div className='candidateModalColumnFlex'>
//                 <div>Remarks:</div>
//                 <TextField 
//                 type='text' 
//                 value={questionRemarks}
//                 variant='outlined'
//                 fullWidth
//                 multiline={true}
//                 rows='2'
//                 onChange={remarkChangeHandler}
//                 sx={{
//                     width: '100%',
//                     fontSize: '14px',
//                     margin: '4px 0px'
//                 }}
//                 />
//             </div>
//             <div className='candidateModalColumnFlex2'>
//                 <div className='candidateModalCheckButtonDiv'>
//                     <button className='candidateModalCheckButton' onClick={markQuestionChecked}><IoMdDoneAll className='tickIcon' size={20}/></button>
//                 </div>
//                 <div>Status : {question['status']}</div>
//             </div>
//         </div>
//         <Divider 
//         style={{
//             width:'100%', 
//             backgroundColor: '#F5B041',
//             marginTop: '4px',
//             marginBottom: '12px'
//         }}
//         />
//         </>
//     )
// }

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

    let addNewQuestionOption = (candidateModalState.section_name!=='' && roundTabState.currentTabType==='interview') ? <CandidateModalInterviewAddQuestion /> : <></>

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
        if(candidateModalState.interviewQuestionCreated===true){
            console.log("Hello")
            dispatch(
                fetchQuestionWiseCandidateSectionMarks({
                    candidate_id: candidateModalState.candidate['id'],
                    section_id: candidateModalState.section_id
                })
            )
            dispatch(updatedCandidateSectionQuestionList())
        }
    },[candidateModalState.interviewQuestionCreated])

    return (
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
    )
}

export default CandidateModal