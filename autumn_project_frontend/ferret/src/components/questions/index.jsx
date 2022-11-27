import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowDropleft } from "react-icons/io"
import { closeQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice";
import { updateQuestion, openCreateQuestionDialog } from "../../features/question/questionSlice";
import { TextField, MenuItem, Select } from "@mui/material";
import QuestionSectionTabDialog from "../question_section_tab_dialog";
import CreateQuestionDialog from "../create_question_dialog";
import './index.css';
import { useState } from "react";

function QuestionSegment(props) {
    const { question, index } = props
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [questionMarks, setQuestionMarks] = useState(question['marks'])
    const [questionAssignee, setQuestionAssignee] = useState(question['assignee']!=null ? question['assignee']['username'] : '')
    const [questionEdit, setQuestionEdit] = useState(false)

    const editClickhandler = () => {
        setQuestionEdit(true)
    }

    const saveClickHandler = () => {
        setQuestionEdit(false)
        dispatch(
            updateQuestion({
                questionId: question['id'],
                questionMarks: questionMarks,
                questionAssignee: questionAssignee
            })
        )
    }

    const marksChangeHandler = (e) => {
        setQuestionMarks(e.target.value)
    }

    const assigneeChangeHandler = (e) => {
        setQuestionAssignee(e.target.value)
    }

    let assignee_list = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['username']}</MenuItem>) : 
    []

    let question_desc = questionEdit ?
    <>
        <div className="editQuestionField">
            <div className="questionMarks">{`( `}</div>
            <TextField 
            required 
            type='number' 
            value={questionMarks}
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
            onChange={marksChangeHandler}
            />
            <div className="questionMarks">{` marks)`}</div>
        </div>
        <div className="editQuestionField">
            <div className="questionMarks">{`Assignee: `}</div>
            <Select 
            required
            value={questionAssignee}
            variant='outlined'
            sx={{
                "color":"#EEEEEE",
                "fontSize":"15px",
                "height":"36px",
                "padding":"4px 16px",
                "borderColor":"#F5B041"
            }}
            onChange={assigneeChangeHandler}
            >
                {assignee_list}
            </Select>
        </div>
    </> :
    <>
        <div className="questionMarks">{`(${questionMarks} marks)`}</div>
        <div className="questionAssignee">Assignee: {questionAssignee}</div>
    </>

    let edit_button = questionEdit ?
    <button className="questionContentButton" onClick={saveClickHandler}>Save</button> :
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
    const seasonTabState = useSelector((state) => state.seasonTab)
    const dispatch = useDispatch()

    let questions = (
        questionState.questions.length>0 ? 
        questionState.questions.map((question,index) => <QuestionSegment key={question['id']} question={question} index={index+1} />) : 
        [])

    const add_question_button = seasonTabState.current_sections.length>0 ?
    <button className="questionContentButton" onClick={() => dispatch(openCreateQuestionDialog())}>+ Question</button> :
    <></>

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
                    <div>
                        {add_question_button}
                    </div>
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
            <QuestionSectionTabDialog round_id={seasonTabState.currentTabId} />
            <CreateQuestionDialog section_id={questionSectionTabState.currentTabId} />
        </div>
    )
}

export default Questions