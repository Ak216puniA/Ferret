import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ROUNDS } from "../../urls";

const initialState = {
    loading: false,
    error: '',
    round:{
        id: 0,
        name: '',
        type: ''
    }
}

export const fetchRound = createAsyncThunk('round/fetchRound', (round_id) => {
    return axios
    .get(
        `${ROUNDS}${round_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

const roundSlice = createSlice({
    name: 'round',
    initialState,
    extraReducers: builder => {
        builder
        .addCase(fetchRound.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchRound.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.round['id'] = action.payload['id']
            state.round['name'] = action.payload['name']
            state.round['type'] = action.payload['type']
            console.log("RESPONSE_FETCH_ROUND")
            console.log(action.payload)
        })
        .addCase(fetchRound.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.round['id'] = 0
            state.round['name'] = ''
            state.round['type'] = ''
            console.log("ERROR_FETCH_ROUND")
            console.log(state.error)
        })
    }
})

export default roundSlice.reducer