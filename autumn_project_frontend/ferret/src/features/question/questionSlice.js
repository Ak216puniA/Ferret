import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { QUESTIONS } from "../../urls"
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    questions: [],
    open: false,
    openDeleteDialog: false,
    questionsChanged: false
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
    .catch((error) => alert("Error creating question: "+error.message))
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

export const updateQuestion = createAsyncThunk('question/updateQuestion', (questionData) => {
    return axios
    .patch(
        `${QUESTIONS}${questionData['questionId']}/`,
        {
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
        console.log("Question patch successful!")
        return response.data
    })
})

export const deleteQuestion = createAsyncThunk('question/deleteQuestion', (questionData) => {
    return axios
    .delete(
        `${QUESTIONS}${questionData['questionId']}`,
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        openCreateQuestionDialog: (state) => {
            state.open = true
        },
        closeCreateQuestionDialog: (state) => {
            state.open = false
        },
        openQuestionDeleteConfirmationDialog:  (state,action) => {
            state.openDeleteDialog = action.payload
        },
        updatedQuestionList: (state) => {
            state.questionsChanged = false
        },
        resetQuestionsState: (state) => {
            state.loading = false
            state.error = ''
            state.questions = []
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
        })
        .addCase(createQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log(state.error)
        })
        .addCase(deleteQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(deleteQuestion.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.openDeleteDialog = false
            state.questionsChanged = true
            console.log("TEST_QUESTION_DELETED...")
            console.log(action.payload)
        })
        .addCase(deleteQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.openDeleteDialog = false
            console.log("TEST_QUESTION_NOT_DELETED...")
            console.log(action.error.message)
        })
    }
})

export default questionSlice.reducer
export const { openCreateQuestionDialog, closeCreateQuestionDialog, resetQuestionsState, openQuestionDeleteConfirmationDialog, updatedQuestionList } = questionSlice.actions