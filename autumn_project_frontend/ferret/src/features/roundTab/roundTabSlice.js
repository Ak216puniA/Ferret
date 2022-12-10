import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { CANDIDATE_SECTION_MARKS, ROUNDS, SECTIONS } from "../../urls";

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

export const fetchCurrentSectionsTotalMarks = createAsyncThunk('roundTab/fetchCurrentSectionsTotalMarks', (candidateSectionData) => {
    return axios
    .post(
        `${CANDIDATE_SECTION_MARKS}`,
        {
            candidate_id: candidateSectionData['candidateId'],
            section_list: candidateSectionData['sectionList']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then((response) => {
        return response.data
    })
})

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
            state.currentTabType = ''
            state.open = false
            state.current_sections = []
            state.current_sections_total_marks = []
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
        .addCase(createRound.fulfilled, (state) => {
            state.loading = false
            state.error = ''
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
        })
        .addCase(fetchSections.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.current_sections = []
            state.current_sections_total_marks = []
            console.log("Sections' fetch unsuccessful!")
        })
        .addCase(fetchCurrentSectionsTotalMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCurrentSectionsTotalMarks.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.current_sections_total_marks = action.payload['data']
        })
        .addCase(fetchCurrentSectionsTotalMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Current sections total marks fetch unsuccessful!")
        })
    }
})

export default roundTabSlice.reducer
export const { tabClicked, openCreateRoundDialog, closeCreateRoundDialog, resetRoundTabState } = roundTabSlice.actions