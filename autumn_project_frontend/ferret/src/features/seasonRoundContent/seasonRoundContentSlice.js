import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { CANDIDATE_ROUND } from "../../urls";

const initialState = {
    loading: false,
    error: '',
    candidate_list: []
}

export const fetchRoundCandidates = createAsyncThunk('seasonRoundContent/fetchRoundCandidates', (round_id) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?round_id=${round_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})


const seasonRoundContentSlice = createSlice({
    name: 'seasonRoundContent',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchRoundCandidates.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchRoundCandidates.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            candidate_list = action.payload
            console.log("Candidates' retrieval successful!")
        })
        .addCase(fetchRoundCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidates' retrieval failed! \n"+state.error)
        })
    }
})

export default seasonRoundContentSlice.reducer