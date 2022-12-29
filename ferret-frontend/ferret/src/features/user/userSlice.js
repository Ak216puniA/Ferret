import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USERS } from "../../urls"

const initialState = {
    loading: false,
    error: '',
    users: [],
}

export const fetchUsers = createAsyncThunk('user/fetchUsers', (year) => {
    return axios
    .get(
        `${USERS}?year=${year}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.users = action.payload
        })
        .addCase(fetchUsers.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.users = []
        })
    }
})

export default userSlice.reducer