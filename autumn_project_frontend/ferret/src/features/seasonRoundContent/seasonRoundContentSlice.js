import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { CANDIDATE_ROUND, CSV, SECTION_MARKS, FILTER_CANDIDATES } from "../../urls";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    candidate_list: [],
    csv_fetched: false,
    csv_uploaded: false,
    move_candidate_list: [],
    open_move_dialog: false,
    section_marks: [],
    candidatesUpdated: false
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
        updateCandidateList: (state,action) => {
            if(action.payload['action']==='add'){
                state.candidate_list = state.candidate_list.concat(action.payload['candidate_list'])
            }else if(action.payload['action']==='delete'){
                let keep
                state.candidate_list = state.candidate_list.filter(candidate => {
                    keep=true
                    for(let i=0; i<action.payload['candidate_list'].length && keep===true; i++){
                        if(action.payload['candidate_list'][i]===candidate['candidate_id']['id']){
                            keep=false
                        }
                    }
                    return keep
                })
            }
        },
        updateSectionMarks: (state,action) => {
            for(let i=0; i<state.section_marks.length; i++){
                if(state.section_marks[i][0]===action.payload['section_marks'][0]){
                    state.section_marks[i] = action.payload['section_marks']
                    i = state.section_marks.length
                }
            }
        },
        updateCandidateListStatus: (state,action) => {
            const field = action.payload['field']==='remarks' ? 'remark' : action.payload['field']
            for(let i=0; i<state.candidate_list.length; i++){
                if(state.candidate_list[i]['id']===action.payload['value']['id']){
                    state.candidate_list[i][field] = action.payload['value'][field]
                    i = state.candidate_list.length
                }
            }
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
        },
    },
    extraReducers: builder => {
        builder
        .addCase(fetchRoundCandidates.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchRoundCandidates.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidatesUpdated = true
            state.candidate_list = action.payload
        })
        .addCase(fetchRoundCandidates.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_list = []
            state.candidatesUpdated = true
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
        .addCase(fetchCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.section_marks = action.payload['data']
            state.candidatesUpdated = false
            state.error = ''
        })
        .addCase(fetchCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.section_marks = []
            state.error = action.error.message
            state.candidatesUpdated = false
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
export const { fetchCSV, unfetchCSV, resetCSVUpload, appendCandidateToMove, removeCandidateFromMove, openMoveCandidatesDialog, closeMoveCandidatesDialog, resetSeasonRoundContentState, resetMoveCandidatesList, updateCandidateList, updateSectionMarks, updateCandidateListStatus } = seasonRoundContentSlice.actions