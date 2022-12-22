import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { QUESTIONS } from "../../urls"
import { filterCandidates, filterCandidatesForCheckingMode } from "../seasonRoundContent/seasonRoundContentSlice"

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
    assigneeQuestionList: [],
    filterCheckingMode: false,
    date: '',
    time: ''
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
            state.filterCheckingMode = action.payload==='Checking Mode' ? true : false
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
        setDate: (state,action) => {
            state.date = action.payload
        },
        setTime: (state,action) => {
            state.time = action.payload
        },
        setFilterValue: (state,action) => {
            switch(action.payload['field']) {
                case 'marksCriteria':
                    state.marksCriteria = action.payload['value']
                    break
                case 'marks':
                    state.marks = action.payload['value']
                    break
                case 'section':
                    state.section = action.payload['value']
                    break
                case 'status':
                    state.status = action.payload['value']
                    break
                case 'assignee':
                    state.assignee = action.payload['value']
                    break
                case 'questionStatus':
                    state.questionStatus = action.payload['value']
                    break
                case 'question':
                    state.question = action.payload['value']
                    break
                case 'date':
                    state.date = action.payload['value']
                    break
                case 'time':
                    state.time = action.payload['value']
                    break
            }
        },
        resetFilterState: (state) => {
            state.loading= false
            state.error= ''
            state.marksCriteria= ''
            state.marks= -1
            state.section= -1
            state.status= ''
            state.date= ''
            state.time= ''
        },
        resetCheckingModeFilterState: (state) => {
            state.assignee = ''
            state.questionStatus = ''
            state.question = ''
            state.assigneeQuestionList = []
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
        .addCase(filterCandidates.fulfilled, (state) => {
            state.open_filter_drawer = false
        })
        .addCase(filterCandidatesForCheckingMode.fulfilled, (state) => {
            state.open_filter_drawer = false
        })
    }
})

export default filterSlice.reducer
export const { openFilterDrawer, selectCategory, setMarks, setMarksCriteria, setSection, setStatus, setAssignee, setQuestionStatus, setQuestion, resetFilterState, resetCheckingModeFilterState, setFilterValue, setDate, setTime } = filterSlice.actions