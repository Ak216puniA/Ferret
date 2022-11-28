import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { CANDIDATE_ROUND, CSV, CANDIDATE_MARKS, SECTION_MARKS } from "../../urls";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    candidate_list: [],
    csv_fetched: false,
    csv_uploaded: false,
    move_candidate_list: [],
    open_move_dialog: false,
    candidate_marks: [],
    section_marks: []
}

export const fetchRoundCandidates = createAsyncThunk('seasonRoundContent/fetchRoundCandidates', (round_id) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?round_id=${round_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        return response.data
    })
})

export const uploadCSV = createAsyncThunk('seasonRoundContent/uploadCSV', (candidate_data) => {
    let formdata = new FormData()
    formdata.append('csv_file',candidate_data['file'])
    formdata.append('round_id',candidate_data['round_id'])
    return axios
    .post(
        `${CSV}`,
        formdata,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        return response.data
    })
})

export const moveCandidates = createAsyncThunk('seasonRoundContent/moveCandidates', (move_data) => {
    console.log(move_data)
    return axios
    .post(
        `${CANDIDATE_ROUND}`,
        {
            candidate_list: move_data['candidate_list'],
            next_round_id: move_data['next_round_id'],
            current_round_id: move_data['current_round_id']
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

export const fetchCandidateMarks = createAsyncThunk('seasonRoundContent/fetchCandidatesMarks', (round_id) => {
    return axios
    .get(
        `${CANDIDATE_MARKS}?round_id=${round_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log("CANDIDATE_MARKS...")
        console.log(response.data)
        return response.data
    })
})

export const fetchCandidateSectionMarks = createAsyncThunk('seasonRoundContent/fetchCandidateSectionMarks', (requestData) => {
    return axios
    .post(
        `${SECTION_MARKS}`,
        {
            candidate_list: requestData['candidate_list'],
            section_list: requestData['section_list'],
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        },
    )
    .then((response) => {
        console.log("SECTION_MARKS...")
        console.log(response.data)
        return response.data
    })
})

const seasonRoundContentSlice = createSlice({
    name: 'seasonRoundContent',
    initialState,
    reducers: {
        fetchCSV: (state) => {
            state.csv_fetched = true
        },
        unfetchCSV: (state) => {
            state.csv_fetched = false
        },
        resetCSVUpload: (state) => {
            state.csv_uploaded = false
        },
        appendCandidateToMove: (state,action) => {
            state.move_candidate_list = state.move_candidate_list.concat([action.payload])
            console.log(state.move_candidate_list)
        },
        removeCandidateFromMove: (state,action) => {
            state.move_candidate_list = state.move_candidate_list.filter(item => item !== action.payload)
            console.log(state.move_candidate_list)
        },
        openMoveCandidatesDialog: (state) => {
            state.open_move_dialog = true
        },
        closeMoveCandidatesDialog: (state) => {
            state.open_move_dialog = false
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchRoundCandidates.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchRoundCandidates.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_list = action.payload
            console.log("Candidates' retrieval successful!")
        })
        .addCase(fetchRoundCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_list = []
            console.log("Candidates' retrieval failed! \n"+state.error)
        })
        .addCase(uploadCSV.pending, (state) => {
            state.loading = true
        })
        .addCase(uploadCSV.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_list = action.payload['data']
            state.csv_uploaded = true
            console.log("CSV upload successful!")
        })
        .addCase(uploadCSV.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_list = []
            state.csv_uploaded = false
            console.log("CSV upload unsuccessful!")
        })
        .addCase(moveCandidates.pending, (state) => {
            state.loading = true
        })
        .addCase(moveCandidates.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.move_candidate_list = []
            console.log("Candidates moved sucessfully!")
        })
        .addCase(moveCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log(state.error)
        })
        .addCase(fetchCandidateMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidateMarks.fulfilled, (state,action) => {
            state.loading = false
            state.candidate_marks = action.payload
            state.error = ''
            console.log("Candidate marks fetch successful!")
        })
        .addCase(fetchCandidateMarks.rejected, (state,action) => {
            state.loading = false
            state.candidate_marks = []
            state.error = action.error.message
            console.log("Candidate marks fetch unsuccessful!")
        })
        .addCase(fetchCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.section_marks = action.payload
            state.error = ''
            console.log("Section marks fetch successful!")
        })
        .addCase(fetchCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.section_marks = []
            state.error = action.error.message
            console.log("Section marks fetch unsuccessful!")
        })
    }
})

export default seasonRoundContentSlice.reducer
export const { fetchCSV, unfetchCSV, resetCSVUpload, appendCandidateToMove, removeCandidateFromMove, openMoveCandidatesDialog, closeMoveCandidatesDialog } = seasonRoundContentSlice.actions