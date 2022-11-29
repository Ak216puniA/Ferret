import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SECTIONS } from "../../urls";
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    currentTab : '',
    currentTabId: -1,
    open: false,
}

export const createSection = createAsyncThunk('sectionTab/createSection', (sectionData) => {
    return axios
    .post(
        `${SECTIONS}`,
        {
            round_id: sectionData['roundId'],
            name: sectionData['name'],
            weightage: sectionData['weightage']
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

const sectionTabSlice = createSlice({
    name: 'sectionTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload['tab_name']
            state.currentTabId = action.payload['tab_id']
        },
        openCreateSectionDialog: (state) => {
            state.open = true
        },
        closeCreateSectionDialog: (state) => {
            state.open = false
        },
        resetSectionTabState: (state) => {
            state.loading = false
            state.error = ''
            state.currentTab = ''
            state.currentTabId = -1
            state.open = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createSection.pending, (state) => {
            state.loading = true
        })
        .addCase(createSection.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.new_name = ''
            state.new_weightage = 0
        })
        .addCase(createSection.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log(state.error)
        })
    }
})

export default sectionTabSlice.reducer
export const { tabClicked, openCreateSectionDialog, closeCreateSectionDialog, resetSectionTabState } = sectionTabSlice.actions