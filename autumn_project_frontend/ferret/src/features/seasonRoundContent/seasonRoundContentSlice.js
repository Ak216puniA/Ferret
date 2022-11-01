import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { CANDIDATE_ROUND, CSV } from "../../urls";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    candidate_list: [],
    csv_fetched: false,
    csv_uploaded: false,
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

export const uploadCSV = createAsyncThunk('csv/uploadCSV', (candidate_data) => {
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
        console.log(response.data)
        alert("CSV uploaded!")
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
            // state.candidate_list = action.payload
            state.csv_uploaded = true
        })
        .addCase(uploadCSV.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            // state.candidate_list = []
            state.csv_uploaded = false
        })
    }
})

export default seasonRoundContentSlice.reducer
export const { fetchCSV, unfetchCSV, resetCSVUpload } = seasonRoundContentSlice.actions