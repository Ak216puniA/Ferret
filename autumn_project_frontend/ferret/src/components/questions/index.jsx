import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowDropleft } from "react-icons/io"
import { closeQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice";
import { editQuestions, handleChangeNewAssignee, handleChangeNewMarks, updateQuestion } from "../../features/question/questionSlice";
import { TextField, MenuItem, Select } from "@mui/material";
import './index.css';
import QuestionSectionTabDialog from "../question_section_tab_dialog";

function QuestionSegment(props) {
    const { question, index } = props
    const questionState = useSelector((state) => state.question)
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const editClickhandler = () => {
        dispatch(
            editQuestions({
                question_id: question['id'],
                marks: question['marks'],
                assignee: question['assignee']
            })
        )
    }

    let question_assignee = question['assignee']!=null ? question['assignee']['username'] : ''

    let assignee_list = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['username']}</MenuItem>) : 
    []

    let question_desc = question['id']===questionState.edit_question_id && questionState.edit ?
    <>
        <div className="editQuestionField">
            <div className="questionMarks">{`( `}</div>
            <TextField 
            required 
            type='number' 
            defaultValue={question['marks']}
            variant='outlined'
            InputProps={{ inputProps: { min: 0 } }}
            sx={{
                input: {
                    color:'#EEEEEE',
                    fontSize:"15px",
                    height:"24px",
                    padding:"4px 16px",
                    borderColor:"#F5B041",
                    width:"100px"
                }
            }}
            fullWidth
            onChange={(event) => dispatch(handleChangeNewMarks(event.target.value))}
            />
            <div className="questionMarks">{` marks)`}</div>
        </div>
        <div className="editQuestionField">
            <div className="questionMarks">{`Assignee: `}</div>
            <Select 
            required 
            defaultValue={question_assignee}
            variant='outlined'
            sx={{
                "color":"#EEEEEE",
                "fontSize":"15px",
                "height":"36px",
                "padding":"4px 16px",
                "borderColor":"#F5B041"
            }}
            onChange={(e) => dispatch(handleChangeNewAssignee(e.target.value))}
            >
                {assignee_list}
            </Select>
        </div>
    </> :
    <>
        <div className="questionMarks">{`(${question['marks']} marks)`}</div>
        <div className="questionAssignee">Assignee: {question_assignee}</div>
    </>

    let edit_button = question['id']===questionState.edit_question_id && questionState.edit ?
    <button className="questionContentButton" onClick={() =>  dispatch(updateQuestion(question['id']))}>Save</button> :
    <button className="questionContentButton" onClick={editClickhandler}>Edit</button>

    return (
    <div className="questionSegment">
        <div className="editQuestionDiv">
            <div className="questionNumber">Q.{index}</div>
            <div>
                {edit_button}
            </div>
        </div>
        <div className="questionText">{question['text']}</div>
        <div className="questionDesc">
            {question_desc}
        </div>
    </div>
    )
}

function Questions() {
    const questionSectionTabState = useSelector((state) => state.questionSectionTab)
    const questionState = useSelector((state) => state.question)
    const dispatch = useDispatch()

    let questions = (
        questionState.questions.length>0 ? 
        questionState.questions.map((question,index) => <QuestionSegment key={question['id']} question={question} index={index+1}/>) : 
        [])

    return (
        <div className="questionPaper">
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className="questionsContent">
                <div className="questionContentButtonDiv">
                    <div className="backButton">
                        <IoMdArrowDropleft size={24}/>
                        <div className="backButtonText" onClick={() => dispatch(closeQuestions())}>Back</div>
                    </div>
                    {/* <div>
                        <button className="questionContentButton">Edit</button>
                    </div> */}
                </div>
                <div className="questionsHeading">Questions</div>
                <div className='questionSectionHeading'>
                    <div className={`questionSectionHeadingLeft rowFlex`}>Section</div>
                    <div className={`questionSectionHeadingRight rowFlex`}>{questionSectionTabState.currentTab}</div>
                </div>
                <div>
                    {questions}
                </div>
            </div>
            <QuestionSectionTabDialog round_id={questionSectionTabState.currentTabId} />
        </div>
    )
}

export default Questions