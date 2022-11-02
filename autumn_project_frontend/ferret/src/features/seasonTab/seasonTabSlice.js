import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { ROUNDS, SECTIONS } from "../../urls";

const initialState = {
    loading : false,
    error : '',
    current_season: 0,
    round_list: [],
    currentTab : '',
    currentTabId : -1,
    open : false,
    new_title: 'title',
    new_type: 'test',
    current_sections: []
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
        return response.data
    })
})

export const createRound = createAsyncThunk('seasonTab/createRound', (s_id, {getState}) => {
    const state = getState()
    return axios
    .post(
        `${ROUNDS}`,
        {
            season_id: s_id,
            name: state.seasonTab.new_title,
            type: state.seasonTab.new_type
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        return response.data
    })
    .catch((error) => alert("New round not created! \n"+error.message))
})

export const fetchSections = createAsyncThunk('question/fetchSections', (round_id) => {
    return axios
    .get(
        `${SECTIONS}?round_id=${round_id}`,
        {
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
            state.currentTab = action.payload['tab_name']
            state.currentTabId = action.payload['tab_id']
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
            alert("Round created: \n"+action.payload)
        })
        .addCase(createRound.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            alert("Round NOT created: \n"+action.error.message)
        })
        .addCase(fetchSections.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchSections.fulfilled, (state, action) => {
            state.loading = false
            state.error = ''
            state.current_sections = action.payload
            console.log("Sections fetched successfully!")
        })
        .addCase(fetchSections.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.current_sections = []
            console.log("Sections' fetch unsuccessful!")
        })
    }
})

export default seasonTabSlice.reducer
export const { tabClicked, openCreateRoundDialog, closeCreateRoundDialog, handleChangeNewTitle, handleChangeNewType } = seasonTabSlice.actions