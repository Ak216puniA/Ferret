import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTab : '',
    currentTabId: -1
}

const questionSectionTabSlice = createSlice({
    name: 'questionSectionTab',
    initialState,
    reducers: {
        tabClicked: (state,action) => {
            state.currentTab = action.payload['tab_name']
            state.currentTabId = action.payload['tab_id']
        }
    }
})

export default questionSectionTabSlice.reducer
export const { tabClicked } = questionSectionTabSlice.actions