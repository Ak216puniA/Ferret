import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { OAUTH_AUTH } from '../../urls'
import Cookies from 'js-cookie';

const initialState = {
    loading : false,
    user : '',
    error : ''
}

const csrf_token = Cookies.get('csrftoken')

let config = {
    headers : {
        Authorization : `Token ${csrf_token}`
    }
}

export const loginUser = createAsyncThunk('login/loginUser', () => {
    return axios
    .get(`${OAUTH_AUTH}`,config={config})
    .then((response) => response.data)
    .catch((error) => {
        console.log(error.message)
    })
})

const loginSlice = createSlice({
    name : 'login',
    initialState,
    extraReducers: builder => {
        builder.addCase(loginUser.pending, state => {
            state.loading = true
        })
        builder.addCase(loginUser.fulfilled, (state,action) => {
            state.loading = false
            state.user = action.payload
            state.error = ''
        })
        builder.addCase(loginUser.rejected, (state,action) => {
            state.loading = false
            state.user = ''
            state.error = action.error.message
        })
    }
})

export default loginSlice.reducer