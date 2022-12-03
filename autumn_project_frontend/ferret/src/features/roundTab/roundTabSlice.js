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
    currentTabType: '',
    open : false,
    current_sections: [],
    current_sections_total_marks: []
}


export const listRounds = createAsyncThunk('roundTab/listRounds', (season_id) => {
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

export const createRound = createAsyncThunk('roundTab/createRound', (roundData) => {
    return axios
    .post(
        `${ROUNDS}`,
        {
            season_id: roundData['season_id'],
            name: roundData['roundTitle'],
            type: roundData['roundType']
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
})

export const fetchSections = createAsyncThunk('roundTab/fetchSections', (round_id) => {
    return axios
    .get(
        `${SECTIONS}?round_id=${round_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

// export const updateSectionTotalMarks = 

const roundTabSlice = createSlice({
    name : 'roundTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload['tab_name']
            state.currentTabId = action.payload['tab_id']
            state.currentTabType = action.payload['tab_type']
        },
        openCreateRoundDialog: (state) => {
            state.open = true
        },
        closeCreateRoundDialog: (state) => {
            state.open = false
        },
        resetRoundTabState: (state) => {
            state.loading = false
            state.error = ''
            state.current_season = 0
            state.round_list = []
            state.currentTab = ''
            state.currentTabId = -1
            state.open = false
            state.current_sections = []
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
            // console.log("ROUND_LIST...")
            // console.log(state.round_list)
        })
        .addCase(listRounds.rejected, (state,action) => {
            state.loading = false
            state.round_list = []
            state.currentTab = ''
            state.error = action.error.message
            console.log("Rounds list not fetched!")
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
            state.current_sections = action.payload['section_list']
            state.current_sections_total_marks = action.payload['section_total_marks_list']
            // console.log("Sections fetched successfully!")
        })
        .addCase(fetchSections.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.current_sections = []
            state.current_sections_total_marks = []
            console.log("Sections' fetch unsuccessful!")
        })
    }
})

export default roundTabSlice.reducer
export const { tabClicked, openCreateRoundDialog, closeCreateRoundDialog, resetRoundTabState } = roundTabSlice.actions