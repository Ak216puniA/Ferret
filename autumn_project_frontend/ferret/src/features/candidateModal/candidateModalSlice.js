import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { CANDIDATES, CANDIDATE_SECTION_MARKS, SECTION_MARKS, CANDIDATE_MARKS } from '../../urls'
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    open_candidate_modal: false,
    candidate_id: 0,
    candidate: [],
    candidate_section_marks: [],
    candidate_question_data: [],
    section_name: ''
}

export const fetchCandidate = createAsyncThunk('candidateModal/fetchCandidate', (candidate_id) => {
    return axios
    .get(
        `${CANDIDATES}${candidate_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const fetchSelectedCandidateSectionMarks = createAsyncThunk('candidateModal/fetchSelectedCandidateSectionMarks', (requestData) => {
    return axios
    .post(
        `${SECTION_MARKS}`,
        {
            candidate_list: requestData['candidate_list'],
            section_list: requestData['section_list'],
        },
        {
            headers: {
                "X-CSRFToken": Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const fetchQuestionWiseCandidateSectionMarks = createAsyncThunk('candidateModal/fetchQuestionWiseCandidateSectionMarks', (requestData) => {
    return axios
    .get(
        `${CANDIDATE_SECTION_MARKS}?candidate_id=${requestData['candidate_id']}&section_id=${requestData['section_id']}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const updateCandidateQuestionMarks = createAsyncThunk('candidateModal/updateCandidateQuestionMarks', (candidateQuestionData) => {
    return axios
    .patch(
        `${CANDIDATE_MARKS}${candidateQuestionData['id']}/`,
        {
            marks: candidateQuestionData['marks'],
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        return response.data
    })
})

export const updateCandidateQuestionStatus = createAsyncThunk('candidateModal/updateCandidateQuestionStatus', (candidateQuestionData) => {
    return axios
    .patch(
        `${CANDIDATE_MARKS}${candidateQuestionData['id']}/`,
        {
            status: 'checked',
            remarks: candidateQuestionData['remarks']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        return response.data
    })
})

const candidateModalSlice = createSlice({
    name: 'candidateModal',
    initialState,
    reducers: {
        openCandidateModal: (state,action) => {
            state.open_candidate_modal = action.payload['open']
            state.candidate_id = action.payload['candidate_id']
        },
        selectSection: (state,action) => {
            state.section_name = action.payload
        },
        resetCandidateModalState: (state) => {
            state.loading = false
            state.error = ''
            state.open_candidate_modal = false
            state.candidate_id = 0
            state.candidate = []
            state.candidate_section_marks = []
            state.candidate_question_data = []
            state.section_name = ''
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchCandidate.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidate.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate = action.payload
        })
        .addCase(fetchCandidate.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate = []
        })
        .addCase(fetchSelectedCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchSelectedCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_section_marks = action.payload['data'][0]
            console.log("CANDIDATE_SECTION_MARKS_FOR_ONE_CANDIDATE...")
            console.log(state.candidate_section_marks)
        })
        .addCase(fetchSelectedCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_section_marks = []
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_question_data = action.payload
            console.log("CANDIDATE_QUESTION_DATA...")
            console.log(state.candidate_question_data)
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_question_data = []
        })
        .addCase(updateCandidateQuestionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCandidateQuestionMarks.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            console.log("Candidate question's marks update successful!")
        })
        .addCase(updateCandidateQuestionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidate question's marks update unsucessful!")
        })
        .addCase(updateCandidateQuestionStatus.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCandidateQuestionStatus.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            console.log("Candidate question's status update successful!")
        })
        .addCase(updateCandidateQuestionStatus.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidate question's status update unsucessful!")
        })
    }
})

export default candidateModalSlice.reducer
export const { openCandidateModal, selectSection, resetCandidateModalState } = candidateModalSlice.actions