import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import Cookies from 'js-cookie';
import { ROUNDS } from "../../urls";

// const csrf_token = Cookies.get('csrftoken')

const initialState = {
    loading : false,
    error : '',
    round_list: [],
    currentTab : '',
    // currentSeason : -1
}

export const listRounds = createAsyncThunk('seasonTab/listRounds', (season_id) => {
    // const state = getState()
    return axios
    .get(
        `${ROUNDS}?season_id=${season_id}`,
        {
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Token ${csrf_token}`
            // }
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        return response.data
    })
})

const seasonTabSlice = createSlice({
    name : 'seasonTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload
        },
        // seasonClicked: (state,action) => {
        //     state.currentSeason = action.payload
        // }
    },
    extraReducers: builder => {
        builder
        .addCase(listRounds.pending, (state) => {
            state.loading = true
        })
        .addCase(listRounds.fulfilled, (state,action) => {
            state.loading = false
            state.round_list = action.payload
            // state.currentTab = action.payload
            state.error = ''
            console.log(state.round_list)
        })
        .addCase(listRounds.rejected, (state,action) => {
            state.loading = false
            state.round_list = []
            state.currentTab = ''
            state.error = action.error.message
            console.log(action.error.message)
        })
    }
})

export default seasonTabSlice.reducer
export const { tabClicked } = seasonTabSlice.actions