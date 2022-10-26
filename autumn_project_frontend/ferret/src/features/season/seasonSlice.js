import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SEASONS_BY_TYPE } from '../../urls'
// import { tabClicked } from '../navigationTab/navigationTabSlice'

const initialState = {
    loading : false,
    season_type : '',
    data : [],
    error : ''
}

export const listSeasons = createAsyncThunk('season/listSeasons', (season_type) => {
    return axios
    .get(
        `${SEASONS_BY_TYPE}?season_type=${season_type}`,
        {
            headers: {
                'Authorization': 'Token EzZM3KZ3b0iHnom7gIXlbv57KokceSQh' 
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
    // .catch((error) => console.log(error))
})

const seasonSlice = createSlice({
    name : 'season',
    initialState,
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
        // .addCase(tabClicked, (state,action) => {
        //     // dispatch(listSeasons(action.payload))
        //     console.log("tabClicked reaching here!")
        //     listSeasons(action.payload)
        //     console.log(state.laoding+" "+state.season_type+" "+state.data+" "+state.error)
        // })
    }
})

export default seasonSlice.reducer