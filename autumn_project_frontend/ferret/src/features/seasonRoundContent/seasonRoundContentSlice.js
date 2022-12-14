import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { CANDIDATE_ROUND, CSV, CANDIDATE_MARKS, SECTION_MARKS, FILTER_CANDIDATES } from "../../urls";
import Cookies from "js-cookie";
import { updateCandidateRoundStatus } from "../candidateModal/candidateModalSlice";

const initialState = {
    loading: false,
    error: '',
    candidate_list: [],
    csv_fetched: false,
    csv_uploaded: false,
    move_candidate_list: [],
    open_move_dialog: false,
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
                "X-CSRFToken": Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const filterCandidates = createAsyncThunk('seasonRoundContent/filterCandidates', (filterData) => {
    return axios
    .post(
        `${FILTER_CANDIDATES}`,
        {
            round_id: filterData['currentRound'],
            checking_mode: false,
            section: filterData['section'],
            status: filterData['status'],
            marks: filterData['marks'],
            marks_criteria: filterData['marksCriteria']
        },
        {
            headers: {
                "X-CSRFToken": Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const filterCandidatesForCheckingMode = createAsyncThunk('seasonRoundContent/filterCandidatesForCheckingMode', (filterData) => {
    return axios
    .post(
        `${FILTER_CANDIDATES}`,
        {
            round_id: filterData['currentRound'],
            checking_mode: true,
            assignee_id: filterData['assigneeId'],
            question_status: filterData['questionStatus'],
            question_id: filterData['questionId']
        },
        {
            headers: {
                "X-CSRFToken": Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
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
        },
        removeCandidateFromMove: (state,action) => {
            state.move_candidate_list = state.move_candidate_list.filter(item => item !== action.payload)
        },
        openMoveCandidatesDialog: (state) => {
            state.open_move_dialog = true
        },
        closeMoveCandidatesDialog: (state) => {
            state.open_move_dialog = false
        },
        resetMoveCandidatesList: (state) => {
            state.move_candidate_list = []
        },
        resetSeasonRoundContentState: (state) => {
            state.loading = false
            state.error = ''
            state.candidate_list = []
            state.csv_fetched = false
            state.csv_uploaded = false
            state.move_candidate_list = []
            state.open_move_dialog = false
            state.candidate_marks = []
            state.section_marks = []
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
        })
        .addCase(fetchRoundCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_list = []
            console.log("Candidates' retrieval failed!")
        })
        .addCase(uploadCSV.pending, (state) => {
            state.loading = true
        })
        .addCase(uploadCSV.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_list = action.payload['data']
            state.csv_uploaded = true
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
        })
        .addCase(moveCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidates not moved!")
        })
        .addCase(fetchCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.section_marks = action.payload['data']
            state.error = ''
        })
        .addCase(fetchCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.section_marks = []
            state.error = action.error.message
            console.log("All candidates' Section marks fetch unsuccessful!")
        })
        .addCase(filterCandidates.pending, (state) => {
            state.loading = true
        })
        .addCase(filterCandidates.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_list = action.payload['data']
        })
        .addCase(filterCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidates not filtered!")
        })
        .addCase(updateCandidateRoundStatus.fulfilled, (state,action) => {
            state.candidate_list.forEach(candidateRound => {
                if(candidateRound['id']===action.payload['id']) candidateRound['status']=action.payload['status']
            })
        })
        .addCase(filterCandidatesForCheckingMode.pending, (state) => {
            state.loading = true
        })
        .addCase(filterCandidatesForCheckingMode.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_list = action.payload['data']
        })
        .addCase(filterCandidatesForCheckingMode.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidates not filtered!")
        })
    }
})

export default seasonRoundContentSlice.reducer
export const { fetchCSV, unfetchCSV, resetCSVUpload, appendCandidateToMove, removeCandidateFromMove, openMoveCandidatesDialog, closeMoveCandidatesDialog, resetSeasonRoundContentState, resetMoveCandidatesList } = seasonRoundContentSlice.actions