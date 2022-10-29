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
    open : false
}

export const listRounds = createAsyncThunk('seasonTab/listRounds', (season_id) => {
    return axios
    .get(
        `${ROUNDS}?season_id=${season_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        console.log("successful rounds retrieval")
        return response.data
    })
})

// export const createRound = createAsyncThunk('seasonTab/createRound', (payload) => {
//     console.log(payload)
//     return 
// })

const seasonTabSlice = createSlice({
    name : 'seasonTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload
        },
        createRound: (state,action) => {
            console.log(action.payload)
        },
        openCreateRoundDialog: (state) => {
            state.open = true
        },
        closeCreateRoundDialog: (state) => {
            state.open = false
        }
    },
    extraReducers: builder => {
        builder
        .addCase(listRounds.pending, (state) => {
            state.loading = true
        })
        .addCase(listRounds.fulfilled, (state,action) => {
            state.loading = false
            state.round_list = action.payload
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
export const { tabClicked, createRound, openCreateRoundDialog, closeCreateRoundDialog } = seasonTabSlice.actions