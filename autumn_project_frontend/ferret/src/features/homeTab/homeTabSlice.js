import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTab : ''
}

const homeTabSlice = createSlice({
    name: 'homeTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload
        }
    }
})

export default homeTabSlice.reducer
export const { tabClicked } = homeTabSlice.actions