import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import Cookies from 'js-cookie';
import { ROUNDS, SEASONS_BY_TYPE } from "../../urls";

// const csrf_token = Cookies.get('csrftoken')

const initialState = {
    loading : false,
    error : '',
    current_season: 0,
    round_list: [],
    currentTab : '',
    open : false,
    new_title: 'title',
    new_type: 'test'
}

export const seasonClicked = createAsyncThunk('seasonTab/seasonClicked', (season_id) => {
    return axios
    .get(
        `${SEASONS_BY_TYPE}?season_id=${season_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        console.log("successful season retrieval")
        return response.data['name']
    })
})

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

export const createRound = createAsyncThunk('seasonTab/createRound', (payload, {getState}) => {
    const state = getState()
    return axios({
        method: "post",
        url: `${ROUNDS}`,
        params: {
            withCredentials: true
        },
        data: {
            name: state.season.new_year,
            end: null,
            description: "",
            type: state.season.new_type,
            image: null
        }
    })
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
        openCreateRoundDialog: (state) => {
            state.open = true
        },
        closeCreateRoundDialog: (state) => {
            state.open = false
        },
        handleChangeNewTitle: (state,action) => {
            state.new_title = action.payload
            console.log(state.new_title)
        },
        handleChangeNewType: (state,action) => {
            state.new_type = action.payload
            console.log(state.new_type)
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
        .addCase(createRound.pending, (state) => {
            state.loading = true
        })
        .addCase(createRound.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.new_title = ' '
            state.new_type = 'test'
            console.log("Round created: \n"+action.payload)
        })
        .addCase(createRound.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Round NOT created: \n"+action.error.message)
        })
    }
})

export default seasonTabSlice.reducer
export const { tabClicked, openCreateRoundDialog, closeCreateRoundDialog, handleChangeNewTitle, handleChangeNewType } = seasonTabSlice.actions