import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
import { CANDIDATE_MARKS, ROUNDS, SECTIONS, SECTION_MARKS } from "../../urls";

const initialState = {
    loading : false,
    error : '',
    current_season: 0,
    round_list: [],
    currentTab : '',
    currentTabId : -1,
    open : false,
    current_sections: [],
    // candidate_marks: [],
    // section_marks: []
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
        console.log("SECTIONS...")
        console.log(response.data)
        return response.data
    })
})

// export const fetchCandidateMarks = createAsyncThunk('roundTab/fetchCandidatesMarks', (round_id) => {
//     return axios
//     .get(
//         `${CANDIDATE_MARKS}?round_id=${round_id}`,
//         {
//             withCredentials: true
//         }
//     )
//     .then((response) => {
//         console.log("CANDIDATE_MARKS...")
//         console.log(response.data)
//         return response.data
//     })
// })

// const fetchCandidateSectionMarks = createAsyncThunk('roundTab/fetchCandidateSectionMarks', (requestData) => {
//     return axios
//     .post(
//         `${SECTION_MARKS}`,
//         {
//             candidate_list: requestData['candidate_list'],
//             section_list: requestData['section_list'],
//         },
//         {
//             headers: {
//                 "X-CSRFToken":Cookies.get('ferret_csrftoken'),
//             },
//             withCredentials:true
//         },
//     )
//     .then((response) => {
//         console.log("SECTION_MARKS...")
//         return response.data
//     })
// })

const roundTabSlice = createSlice({
    name : 'roundTab',
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
        // .addCase(fetchCandidateMarks.pending, (state) => {
        //     state.loading = true
        // })
        // .addCase(fetchCandidateMarks.fulfilled, (state,action) => {
        //     state.loading = false
        //     state.candidate_marks = action.payload
        //     state.error = ''
        //     console.log("Candidate marks fetch successful!")
        // })
        // .addCase(fetchCandidateMarks.rejected, (state,action) => {
        //     state.loading = false
        //     state.candidate_marks = []
        //     state.error = action.error.message
        //     console.log("Candidate marks fetch unsuccessful!")
        // })
        // .addCase(fetchCandidateSectionMarks.pending, (state) => {
        //     state.loading = true
        // })
        // .addCase(fetchCandidateSectionMarks.fulfilled, (state,action) => {
        //     state.loading = false
        //     state.section_marks = action.payload
        //     state.error = ''
        //     console.log("Section marks fetch successful!")
        // })
        // .addCase(fetchCandidateSectionMarks.rejected, (state,action) => {
        //     state.loading = false
        //     state.section_marks = []
        //     state.error = action.error.message
        //     console.log("Section marks fetch unsuccessful!")
        // })
    }
})

export default roundTabSlice.reducer
export const { tabClicked, openCreateRoundDialog, closeCreateRoundDialog } = roundTabSlice.actions