import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { CANDIDATES, SECTION_MARKS } from '../../urls'
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    open_candidate_modal: false,
    candidate_id: 0,
    candidate: [],
    candidate_section_marks: []
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

const candidateModalSlice = createSlice({
    name: 'candidateModal',
    initialState,
    reducers: {
        openCandidateModal: (state,action) => {
            state.open_candidate_modal = action.payload['open']
            state.candidate_id = action.payload['candidate_id']
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
    }
})

export default candidateModalSlice.reducer
export const { openCandidateModal } = candidateModalSlice.actions