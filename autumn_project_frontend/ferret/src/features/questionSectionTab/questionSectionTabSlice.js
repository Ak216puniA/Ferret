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
    new_name: '',
    new_weightage: 0,
}

export const createSection = createAsyncThunk('questionSectionTab/createSection', (round_id, {getState}) => {
    const state = getState()
    return axios
    .post(
        `${SECTIONS}`,
        {
            round_id: round_id,
            name: state.questionSectionTab.new_name,
            weightage: state.questionSectionTab.new_weightage
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

const questionSectionTabSlice = createSlice({
    name: 'questionSectionTab',
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
        handleChangeNewName: (state,action) => {
            state.new_name = action.payload
        },
        handleChangeNewWeightage: (state,action) => {
            state.new_weightage = action.payload
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

export default questionSectionTabSlice.reducer
export const { tabClicked, openCreateSectionDialog, closeCreateSectionDialog, handleChangeNewName, handleChangeNewWeightage } = questionSectionTabSlice.actions