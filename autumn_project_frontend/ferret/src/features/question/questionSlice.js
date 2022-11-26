import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { QUESTIONS } from "../../urls"
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    questions: [],
    edit: false,
    edit_question_id: 0,
    open: false,
}

export const createQuestion = createAsyncThunk('question/createQuestion', (questionData) => {
    return axios
    .post(
        `${QUESTIONS}`,
        {
            section_id: questionData['section_id'],
            text: questionData['questionText'],
            marks: questionData['questionMarks'],
            assignee: questionData['questionAssignee']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        console.log("Question created successful!")
        return response.data
    })
    .catch((error) => alert(error.message))
})

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', (section_id) => {
    return axios
    .get(
        `${QUESTIONS}?section_id=${section_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const updateQuestion = createAsyncThunk('question/updateQuestion', (question_id,{getState}) => {
    const state = getState()
    return axios
    .patch(
        `${QUESTIONS}${question_id}/`,
        {
            marks: state.question.new_marks,
            assignee: state.question.new_assignee
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        console.log("Question patch successful!")
        return response.data
    })
})

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        editQuestions: (state,action) => {
            state.edit = true
            state.edit_question_id = action.payload['question_id']
            state.new_marks = action.payload['marks']
            state.new_assignee = action.payload['assignee']
        },
        openCreateQuestionDialog: (state) => {
            state.open = true
        },
        closeCreateQuestionDialog: (state) => {
            state.open = false
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchQuestions.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchQuestions.fulfilled, (state, action) => {
            state.loading = false
            state.error = ''
            state.questions = action.payload
            console.log("Questions fetched successfully!")
        })
        .addCase(fetchQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.questions = []
            console.log("Questions' fetch unsuccessful!")
        })
        .addCase(updateQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(updateQuestion.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.edit = false
            state.edit_question_id = 0
            state.new_marks = 0
            state.new_assignee = 0
        })
        .addCase(updateQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log(state.error)
        })
        .addCase(createQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(createQuestion.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.new_marks = 0
            state.new_assignee = 0
            state.new_text = ''
        })
        .addCase(createQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log(state.error)
        })
    }
})

export default questionSlice.reducer
export const { editQuestions, openCreateQuestionDialog, closeCreateQuestionDialog } = questionSlice.actions