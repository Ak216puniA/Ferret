import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowDropleft } from "react-icons/io"
import { closeQuestions } from "../../features/seasonSubHeader/seasonSubHeaderSlice";
import './index.css';

function QuestionSegment(props) {
    const { question, index } = props
     return (
        <div className="questionSegment">
            <div className="questionNumber">Q.{index}</div>
            <div className="questionText">{question['text']}</div>
            <div className="questionDesc">
                <div className="questionMarks">{`(${question['marks']} marks)`}</div>
                <div className="questionAssignee">Assignee: {question.assignee}</div>
            </div>
        </div>
     )
}

function Questions() {
    const questionSectionTabState = useSelector((state) => state.questionSectionTab.currentTab)
    const questionState = useSelector((state) => state.question.questions)
    // const seasonSubHeaderState = useSelector((state) => state.seasonSubHeader.open_questions)
    const dispatch = useDispatch()

    let questions = (
        questionState.length>0 ? 
        questionState.map((question,index) => <QuestionSegment key={question['id']} question={question} index={index+1}/>) : 
        [])

    return (
        <div className="questionPaper">
            <div className='contentTriangleDiv'>
                <div className='topLeftCornerDark'></div>
                <div className='topRightCornerDark'></div>
            </div>
            <div className="questionsContent">
                <div className="backButton">
                    <IoMdArrowDropleft size={24}/>
                    <div className="backButtonText" onClick={() => dispatch(closeQuestions())}>Back</div>
                </div>
                <div className="questionsHeading">Questions</div>
                <div className='questionSectionHeading'>
                    <div className={`questionSectionHeadingLeft rowFlex`}>Section</div>
                    <div className={`questionSectionHeadingRight rowFlex`}>{questionSectionTabState}</div>
                </div>
                <div>
                    {questions}
                </div>
            </div>
        </div>
    )
}

export default Questions