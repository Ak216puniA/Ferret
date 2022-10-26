import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SEASONS_BY_TYPE } from '../../urls'
import Cookies from 'js-cookie';

const csrf_token = Cookies.get('csrftoken')

const initialState = {
    loading : false,
    season_type : '',
    data : [],
    error : '',
    open : false
}

export const listSeasons = createAsyncThunk('season/listSeasons', (season_type) => {
    return axios
    .get(
        `${SEASONS_BY_TYPE}?season_type=${season_type}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${csrf_token}`
            }
        }
    )
    .then((response) => {
        console.log(response.data)
        const payload = {
            type : season_type,
            data : response.data
        }
        return payload
    })
})

const seasonSlice = createSlice({
    name : 'season',
    initialState,
    reducers: {
        openCreateSeasonDialog: (state) => {
            state.open = true
        },
        closeCreateSeasonDialog: (state) => {
            state.open = false
        }
    },
    extraReducers: builder => {
        builder
        .addCase(listSeasons.pending, (state) => {
            state.loading = true
        })
        .addCase(listSeasons.fulfilled, (state,action) => {
            state.loading = false
            state.season_type = action.payload['type']
            state.data = action.payload['data']
            state.error = ''
        })
        .addCase(listSeasons.rejected, (state,action) => {
            state.loading = false
            state.data = []
            state.error = action.error.message
        })
    }
})

export default seasonSlice.reducer
export const {openCreateSeasonDialog,closeCreateSeasonDialog} = seasonSlice.actions