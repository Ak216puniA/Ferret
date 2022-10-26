import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTab : '',
}

const navigationTabSlice = createSlice({
    name : 'navigationTab',
    initialState,
    reducers: {
        tabClicked : (state,action) => {
            state.currentTab = action.payload
        }
    }
})

export default navigationTabSlice.reducer
export const { tabClicked } = navigationTabSlice.actions