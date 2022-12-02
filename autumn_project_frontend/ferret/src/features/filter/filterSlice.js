import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    error: '',
    open_filter_drawer: false,
    category: ''
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
        }
    }
})

export default filterSlice.reducer
export const { openFilterDrawer, selectCategory} = filterSlice.actions