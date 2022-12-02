import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    error: '',
    open_filter_drawer: false,
    category: '',
    marksCriteria: '',
    marks: -1,
    section: -1,
    status: -1
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        openFilterDrawer: (state,action) => {
            state.open_filter_drawer = action.payload
        },
        selectCategory: (state,action) => {
            state.category = action.payload
        },
        setMarksCriteria: (state,action) => {
            state.marksCriteria = action.payload
            console.log(state.marksCriteria)
        },
        setMarks: (state,action) => {
            state.marks = action.payload
            console.log(state.marks)
        },
        setSection: (state,action) => {
            state.section = action.payload
            console.log(state.section)
        },
        setStatus: (state,action) => {
            state.status = action.payload
            console.log(state.status)
        },
        resetFilterState: (state) => {
            state.loading= false
            state.error= ''
            state.open_filter_drawer= false
            state.category= ''
            state.marksCriteria= ''
            state.marks= -1
            state.section= -1
            state.status= -1
        }
    }
})

export default filterSlice.reducer
export const { openFilterDrawer, selectCategory, setMarks, setMarksCriteria, setSection, setStatus} = filterSlice.actions