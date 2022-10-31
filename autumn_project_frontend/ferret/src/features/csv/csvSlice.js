import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CSV } from "../../urls";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    csv_fetched: false,
    csv: '',
    csv_uploaded: false,
}

export const uploadCSV = createAsyncThunk('csv/uploadCSV', (file) => {
    return axios
    .post(
        `${CSV}`,
        {
            csv: file
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

const csvSlice = createSlice({
    name: 'csv',
    initialState,
    reducers: {
        fetchCSV: (state) => {
            state.csv_fetched = true
        },
        unfetchCSV: (state) => {
            state.csv_fetched = false
        },
        setCSV: (state,action) => {
            state.csv = action.payload
        },
    }
})

export default csvSlice.reducer
export const { fetchCSV, unfetchCSV, setCSV} = csvSlice.actions