import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    error: '',
    open_candidate_modal: false
}

const candidateModalSlice = createSlice({
    name: 'candidateModal',
    initialState,
    reducers: {
        openCandidateModal: (state,action) => {
            state.open_candidate_modal = action.payload
        }
    }
})

export default candidateModalSlice.reducer
export const { openCandidateModal } = candidateModalSlice.actions