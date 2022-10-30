import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SECTIONS } from "../../urls"

const initialState = {
    loading: false,
    error: '',
    questions: [],
    // current_sections: []
}

// const fetchQuestions = createAsyncThunk('question/fetchQuestions', (round_id) => {
//     return axios
//     .get
// })

// export const fetchSections = createAsyncThunk('question/fetchSections', (round_id) => {
//     return axios
//     .get(
//         `${SECTIONS}?round_id=${round_id}`,
//         {
//             withCredentials: true
//         }
//     )
//     .then((response) => {
//         console.log("Sections fetched:\n"+response.data)
//         return response.data
//     })
// })

const questionSlice = createSlice({
    name: 'question',
    initialState,
    // extraReducers: builder => {
    //     builder
        // .addCase(fetchSections.pending, (state) => {
        //     state.loading = true
        // })
        // .addCase(fetchSections.fulfilled, (state, action) => {
        //     state.loading = false
        //     state.error = ''
        //     state.current_sections = action.payload
        //     console.log("Sections fetched successfully!")
        // })
        // .addCase(fetchSections.rejected, (state, action) => {
        //     state.loading = false
        //     state.error = action.error.message
        //     state.current_sections = []
        //     console.log("Sections' fetch unsuccessful!")
        // })
    // }
})

export default questionSlice.reducer