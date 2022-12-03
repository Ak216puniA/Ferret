import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowDropleft } from "react-icons/io"
import { updateQuestion, openCreateQuestionDialog, openQuestionDeleteConfirmationDialog, deleteQuestion, fetchQuestions, updatedQuestionList } from "../../features/question/questionSlice";
import { TextField, MenuItem, Select } from "@mui/material";
import CreateQuestionDialog from "../create_question_dialog";
import './index.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateSectionDialog from "../create_section_dialog";
import { useParams } from "react-router-dom";
import { resetSectionTabState } from "../../features/sectionTab/sectionTabSlice";
import DeleteConfirmationDialog from "../delete_confirmation_dialog";
import { MdDelete } from 'react-icons/md'
import { useEffect } from "react";

function QuestionSegment(props) {
    const { question, index } = props
    const userState = useSelector((state) => state.user)
    const roundTabState = useSelector((state) => state.roundTab)
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

    const questionDeleteHandler = () => {
        dispatch(
            openQuestionDeleteConfirmationDialog({
                open: true,
                deleteQuestionId: question['id']
            })
        )
    }

    let assignee_list = userState.users.length>0 ?
    userState.users.map(user => <MenuItem key={user['id']} value={user['id']}>{user['username']}</MenuItem>) : 
    []

    let questionAssigneeComponent = roundTabState.currentTabType==='test' ?
    <div className="questionAssignee">Assignee: {questionAssignee}</div> :
    <></>

    let questionAssigneeEditComponent = roundTabState.currentTabType==='test' ?
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
    </div> :
    <></>

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
        {questionAssigneeEditComponent}
    </> :
    <>
        <div className="questionMarks">{`(${questionMarks} marks)`}</div>
        {questionAssigneeComponent}
    </>

    let edit_button = questionEdit ?
    <button className="questionContentButton" onClick={saveClickHandler}>Save</button> :
    <button className="questionContentButton" onClick={editClickhandler}>Edit</button>

    return (
        <>
        <div className="questionSegment">
            <div className="editQuestionDiv">
                <div className="questionNumberDiv">
                    <div className="questionNumber">Q.{index}</div>
                    <div className='candidateModalQuestionDeleteIconDiv' onClick={questionDeleteHandler}><MdDelete color='#C0392B' size={18} /></div>
                </div>
                <div>
                    {edit_button}
                </div>
            </div>
            <div className="questionText">{question['text']}</div>
            <div className="questionDesc">
                {question_desc}
            </div>
        </div>
        </>
    )
}

function QuestionsContent() {
    const {season_id,round_id} = useParams()
    const sectionTabState = useSelector((state) => state.sectionTab)
    const questionState = useSelector((state) => state.question)
    const roundTabState = useSelector((state) => state.roundTab)
    const dispatch = useDispatch()

    let navigate = useNavigate()
    const routeChange = () => {
        localStorage.setItem('questions','close')
        dispatch(resetSectionTabState())
        const url = `/season/${season_id}`
        navigate(url)
    }

    const dialogCloseHandler = () => {
        dispatch(
            openQuestionDeleteConfirmationDialog({
                open: false,
                deleteQuestionId: 0
            })
        )
    }

    const agreeActionClickHandler = () => {
        dispatch(
            deleteQuestion({
                questionId: questionState.deleteQuestionId
            })
        )
    }

    let questions = (
        questionState.questions.length>0 ? 
        questionState.questions.map((question,index) => <QuestionSegment key={question['id']} question={question} index={index+1} />) : 
        [])

    const add_question_button = roundTabState.current_sections.length>0 ?
    <button className="questionContentButton" onClick={() => dispatch(openCreateQuestionDialog())}>+ Question</button> :
    <></>

    useEffect(() => {
        if(questionState.questionsChanged===true){
            dispatch(fetchQuestions(sectionTabState.currentTabId))
            dispatch(updatedQuestionList())
        }
    },[questionState.questionsChanged])

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
                        <div className="backButtonText" onClick={() => routeChange()}>Back</div>
                    </div>
                    <div>
                        {add_question_button}
                    </div>
                </div>
                <div className="questionsHeading">Questions</div>
                <div className='questionSectionHeading'>
                    <div className={`questionSectionHeadingLeft rowFlex`}>Section</div>
                    <div className={`questionSectionHeadingRight rowFlex`}>{sectionTabState.currentTab}</div>
                </div>
                <div>
                    {questions}
                </div>
            </div>
            <CreateSectionDialog round_id={round_id} />
            <CreateQuestionDialog section_id={sectionTabState.currentTabId} />
            <DeleteConfirmationDialog 
            open={questionState.openDeleteDialog} 
            dialogCloseHandler={dialogCloseHandler} 
            agreeActionClickHandler={agreeActionClickHandler}
            />
        </div>
    )
}

export default QuestionsContent