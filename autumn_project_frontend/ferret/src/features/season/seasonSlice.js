import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SEASONS_BY_TYPE } from '../../urls'
import Cookies from 'js-cookie';

const initialState = {
    loading : false,
    season_type : '',
    season_list : [],
    error : '',
    open : false,
}

export const listSeasons = createAsyncThunk('season/listSeasons', (season_type) => {
    return axios
    .get(
        `${SEASONS_BY_TYPE}?season_type=${season_type}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        const payload = {
            type : season_type,
            data : response.data
        }
        return payload
    })
})

export const createSeason = createAsyncThunk('season/createSeason', (seasonData) => {
    return axios
    .post(
        `${SEASONS_BY_TYPE}`,
        {
            name: seasonData['year'],
            end: null,
            description: seasonData['desc'],
            type: seasonData['type'],
            image: null
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
    .catch((error) =>  alert("Cannot create new season! \n"+error.message))
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
        },
        // resetState: (state) => {
        //     state.loading = false
        //     state.season_type = ''
        //     state.season_list = []
        //     state.error = ''
        //     state.open = false
        // }
    },
    extraReducers: builder => {
        builder
        .addCase(listSeasons.pending, (state) => {
            state.loading = true
        })
        .addCase(listSeasons.fulfilled, (state,action) => {
            state.loading = false
            state.season_type = action.payload['type']
            state.season_list = action.payload['data']
            state.error = ''
        })
        .addCase(listSeasons.rejected, (state,action) => {
            state.loading = false
            state.season_list = []
            state.error = action.error.message
        })
        .addCase(createSeason.pending, (state) => {
            state.loading = true
        })
        .addCase(createSeason.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.new_year = 0
            state.new_type = ''
            console.log("Created new season")
        })
        .addCase(createSeason.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default seasonSlice.reducer
export const {openCreateSeasonDialog,closeCreateSeasonDialog,handleChangeNewYear,handleChangeNewType} = seasonSlice.actions