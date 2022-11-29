import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { CANDIDATES } from '../../urls'

const initialState = {
    loading: false,
    error: '',
    open_candidate_modal: false,
    candidate_id: 0,
    // candidate: {
    //     id: 0,
    //     name: '',
    //     email: '',
    //     enrollment_no: 0,
    //     year: 0,
    //     mobile_no: 0,
    //     cg: 0,
    //     current_round_id: 0
    // }
    candidate: [],
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
    }
})

export default candidateModalSlice.reducer
export const { openCandidateModal } = candidateModalSlice.actions