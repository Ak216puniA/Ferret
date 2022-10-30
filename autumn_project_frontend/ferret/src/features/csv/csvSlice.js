import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: '',
    csv_fetched: false,
    csv: '',
    csv_uploaded: false,
}

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