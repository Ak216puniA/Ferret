import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { QUESTIONS } from "../../urls"

const initialState = {
    loading: false,
    error: '',
    open_filter_drawer: false,
    category: '',
    marksCriteria: '',
    marks: -1,
    section: -1,
    status: '',
    assignee: '',
    questionStatus: '',
    question: '',
    assigneeQuestionList: []
}

export const fetchAssigneeQuestionList = createAsyncThunk('filter/fetchAssigneeQuestionList', (assigneeQuestionData) => {
    return axios
    .get(
        `${QUESTIONS}?round_id=${assigneeQuestionData['roundId']}&assignee_id=${assigneeQuestionData['assigneeId']}&question_status=${assigneeQuestionData['status']}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        openFilterDrawer: (state,action) => {
            state.open_filter_drawer = action.payload
        },
        selectCategory: (state,action) => {
            state.category = action.payload
        },
        setMarksCriteria: (state,action) => {
            state.marksCriteria = action.payload
        },
        setMarks: (state,action) => {
            state.marks = action.payload
        },
        setSection: (state,action) => {
            state.section = action.payload
        },
        setStatus: (state,action) => {
            state.status = action.payload
        },
        setAssignee: (state,action) => {
            state.assignee = action.payload
        },
        setQuestionStatus: (state,action) => {
            state.questionStatus = action.payload
        },
        setQuestion: (state,action) => {
            state.question = action.payload
        },
        resetFilterState: (state) => {
            state.loading= false
            state.error= ''
            state.marksCriteria= ''
            state.marks= -1
            state.section= -1
            state.status= ''
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchAssigneeQuestionList.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchAssigneeQuestionList.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.assigneeQuestionList = action.payload
        })
        .addCase(fetchAssigneeQuestionList.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.assigneeQuestionList = []
            console.log("Assignee question list fetch unsuccessful!")
        })
    }
})

export default filterSlice.reducer
export const { openFilterDrawer, selectCategory, setMarks, setMarksCriteria, setSection, setStatus, setAssignee, setQuestionStatus, setQuestion, resetFilterState} = filterSlice.actions