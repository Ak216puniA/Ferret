import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SEASONS } from '../../urls'
import Cookies from 'js-cookie';

const initialState = {
    loading : false,
    season_type : '',
    season_list : [],
    error : '',
    open : false,
    openConfirmationDialog: false,
    endSeasonId: 0
}

export const listSeasons = createAsyncThunk('season/listSeasons', (season_type) => {
    return axios
    .get(
        `${SEASONS}?season_type=${season_type}`,
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
        `${SEASONS}`,
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

export const endSeason = createAsyncThunk('season/endSeason', (seasonData) => {
    return axios
    .patch(
        `${SEASONS}${seasonData['seasonId']}/`,
        {
            end: seasonData['end']
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
        openEndSeasonConfirmationDialog: (state,action) => {
            state.openConfirmationDialog = action.payload['open']
            state.endSeasonId = action.payload['seasonId']
        },
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
        .addCase(createSeason.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.new_year = 0
            state.new_type = ''
        })
        .addCase(createSeason.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
        })
        .addCase(endSeason.pending, (state) => {
            state.loading = true
        })
        .addCase(endSeason.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            for(let i=0; i<state.season_list.length; i++){
                if(state.season_list[i]['id']===action.payload['id']){
                    state.season_list[i]['end'] = action.payload['end']
                    i = state.season_list.length
                }
            }
            state.openConfirmationDialog = false
            state.endSeasonId = 0
        })
        .addCase(endSeason.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.openConfirmationDialog = false
            state.endSeasonId = 0
            console.log("End season patch unsuccessful!")
        })
    }
})

export default seasonSlice.reducer
export const {openCreateSeasonDialog,closeCreateSeasonDialog,openEndSeasonConfirmationDialog} = seasonSlice.actions