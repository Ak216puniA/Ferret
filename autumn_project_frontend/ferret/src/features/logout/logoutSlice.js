import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LOGOUT } from "../../urls"

const initialState = {
    authenticated: true,
    data: [],
    error: ''
}

export const logoutUser = createAsyncThunk('logout/logoutUser', () => {
    return axios
    .get(`${LOGOUT}`)
    .then((response) => {
        localStorage.setItem('authenticated',!response.data['logged_out'])
        return response.data
    })
    // .catch((error) => console.log(error))
})

const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    extraReducers: builder => {
        builder
        .addCase(logoutUser.pending, (state) => {
            state.authenticated = true
        })
        .addCase(logoutUser.fulfilled, (state,action) => {
            state.authenticated = false
            state.data = action.payload
            state.error = ''
        })
        .addCase(logoutUser.rejected, (state,action) => {
            state.authenticated = true
            state.data = []
            state.error = action.error.message
        })
    }
})

export default logoutSlice.reducer