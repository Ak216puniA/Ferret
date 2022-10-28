import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading : false,
    error : '',
    round_list: [],
    currentTab : '',
    currentSeason : -1
}

export const listRounds = createAsyncThunk('seasonTab/listRounds')

const seasonTabSlice = createSlice({
    name : 'seasonTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload
        },
        seasonClicked: (state,action) => {
            state.currentSeason = action.payload
        }
    }
})

export default seasonTabSlice.reducer
export const { tabClicked, seasonClicked } = seasonTabSlice.actions