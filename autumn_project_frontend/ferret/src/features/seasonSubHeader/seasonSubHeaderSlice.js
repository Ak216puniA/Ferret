import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SEASONS_BY_TYPE } from "../../urls"

const initialState = {
    loading: false,
    current_season_type: '',
    current_season_year: 0,
    current_season_desc: '',
    open_questions: false
}

export const fetchCurrentSeason = createAsyncThunk('seasonSubHeader/fetchCurrentSeason', (season_id) => {
    return axios
    .get(
        `${SEASONS_BY_TYPE}?season_id=${season_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

const seasonSubHeaderSlice = createSlice({
    name: 'seasonSubHeader',
    initialState,
    reducers: {
        openQuestions: (state) => {
            state.open_questions = true
        },
        closeQuestions: (state) => {
            state.open_questions = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCurrentSeason.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCurrentSeason.fulfilled, (state,action) => {
            state.loading = false
            state.current_season_year = action.payload[0]['name']
            state.current_season_type = action.payload[0]['type']
            state.current_season_desc = action.payload[0]['description']
            console.log("Fetched season \n"+action.payload)
        })
        .addCase(fetchCurrentSeason.rejected, (state,action) => {
            state.loading = false
            console.log(action.error.message)
        })
    }
})

export default seasonSubHeaderSlice.reducer
export const { openQuestions, closeQuestions } = seasonSubHeaderSlice.actions