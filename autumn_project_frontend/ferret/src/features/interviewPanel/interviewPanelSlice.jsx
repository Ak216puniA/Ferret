import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { INTERVIEW_PANEL } from "../../urls";

const initialState = {
    loading: false,
    error: '',
    panelList: []
}

export const fetchInterviewPanels = createAsyncThunk('interviewPanel/fetchInterviewPanels', (seasonId) => {
    return axios
    .get(
        `${INTERVIEW_PANEL}?season_id=${seasonId}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        return response.data
    })
})

const interviewPanelSlice = createSlice({
    name: 'interviewPanel',
    initialState,
    extraReducers: builder => {
        builder
        .addCase(fetchInterviewPanels.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchInterviewPanels.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panelList = action.payload
        })
        .addCase(fetchInterviewPanels.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.panelList = []
            console.log("Interview panels fetch unsuccessful!")
        })
    }
})

export default interviewPanelSlice.reducer