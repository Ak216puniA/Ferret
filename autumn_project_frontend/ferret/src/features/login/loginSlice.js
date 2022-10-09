import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { OAUTH_AUTH_ROOT } from '../../urls'

const initialState = {
    loading : false,
    user : '',
    error : ''
}

export const loginUser = createAsyncThunk('login/loginUser', () => {
    return axios
    .get({OAUTH_AUTH_ROOT})
    .then((response) => response.data)
})

const loginSlice = createSlice({
    name : login,
    initialState,
    extraReducers: builder => {
        builder.addCase(loginUser.pending, state => {
            state.loading = true
        })
        builder.addCase(loginUser.fulfilled, (state,action) => {
            state.loading = false
            state.user = action.payload
            error = ''
        })
        builder.addCase(loginUser.rejected, (state,action) => {
            state.loading = false
            state.user = ''
            error = action.error.message
        })
    }
})

export default loginSlice.reducer