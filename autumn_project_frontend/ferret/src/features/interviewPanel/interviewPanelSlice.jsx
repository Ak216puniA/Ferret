import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { CANDIDATE_ROUND, INTERVIEW_PANEL } from "../../urls";
import Cookies from "js-cookie";
import { listRounds } from "../roundTab/roundTabSlice";

const initialState = {
    loading: false,
    error: '',
    panel: {
        id: 0,
        season_id: 0,
        panel_name: '',
        panelist: [],
        location: '',
        status: '',
    },
    panelList: [],
    openDialog: false,
    panelRoundList: [],
    panelCandidateList: [],
}

export const fetchInterviewPanels = createAsyncThunk('interviewPanel/fetchInterviewPanels', (seasonId) => {
    return axios
    .get(
        `${INTERVIEW_PANEL}?season_id=${seasonId}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        return response.data
    })
})

export const updateInterviewPanelStatus = createAsyncThunk('interviewPanel/updateInterviewPanelStatus', (panelStatusData) => {
    return axios
    .patch(
        `${INTERVIEW_PANEL}${panelStatusData['panelId']}/`,
        {
            status: panelStatusData['status']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const updatePanelCandidateOptions = createAsyncThunk('interviewPanel/updatePanelCandidateOptions', (panelRoundData) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?round_id=${panelRoundData['roundId']}&ready_for_interview=${true}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        console.log(response.data)
        return response.data
    })
})

export const updatePanelRoundOptions = createAsyncThunk('interviewPanel/updatePanelRoundOptions', (panelRoundData) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?candidate_id=${panelRoundData['candidateId']}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const updateCandidateRoundInterviewPanel = createAsyncThunk('interviewPanel/updateCandidateRoundInterviewPanel', (candidateInterviewData) => {
    return axios
    .patch(
        `${CANDIDATE_ROUND}${candidateInterviewData['candidateRoundId']}/`,
        {
            interview_panel: candidateInterviewData['interviewPanelId']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then((response) => {
        return response.data
    })
})

const interviewPanelSlice = createSlice({
    name: 'interviewPanel',
    initialState,
    reducers: {
        openInterviewDialog: (state,action) => {
            state.openDialog = action.payload['open']
            state.panel = action.payload['panel']
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchInterviewPanels.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchInterviewPanels.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panelList = action.payload
        })
        .addCase(fetchInterviewPanels.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.panelList = []
            console.log("Interview panels fetch unsuccessful!")
        })
        .addCase(updateInterviewPanelStatus.pending, (state) => {
            state.loading = true
        })
        .addCase(updateInterviewPanelStatus.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panel['status'] = action.payload['status']
            state.panelList.forEach(panel => {
                panel['status'] = panel['id']===state.panel['id'] ? action.payload['status'] : panel['status']
            })
            console.log(state.panel)
        })
        .addCase(updateInterviewPanelStatus.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Interview panel status update unsuccessful!")
        })
        .addCase(updatePanelCandidateOptions.pending, (state) => {
            state.loading = true
        })
        .addCase(updatePanelCandidateOptions.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panelCandidateList = action.payload
        })
        .addCase(updatePanelCandidateOptions.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log('Cannot update panel candidate list by round!')
        })
        .addCase(updatePanelRoundOptions.pending, (state) => {
            state.loading = true
        })
        .addCase(updatePanelRoundOptions.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panelRoundList = action.payload.map(candidateRound => candidateRound['round_id'])
        })
        .addCase(updatePanelRoundOptions.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Cannot update panel round list by candidate!")
        })
        .addCase(listRounds.fulfilled, (state,action) => {
            state.panelRoundList = action.payload
        })
        .addCase(updateCandidateRoundInterviewPanel.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCandidateRoundInterviewPanel.fulfilled, (state) => {
            state.loading = false
            state.error = ''
        })
        .addCase(updateCandidateRoundInterviewPanel.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Interview panel not updated in candidate round!")
        })
    }
})

export default interviewPanelSlice.reducer
export const { openInterviewDialog } = interviewPanelSlice.actions