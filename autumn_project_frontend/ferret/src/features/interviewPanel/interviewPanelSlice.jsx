import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { CANDIDATE_ROUND, INTERVIEW_PANEL, SECTION_MARKS } from "../../urls";
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
    panelRoundList: [],
    panelCandidateList: [],
    openInterviewModal: false,
    openCreatePanelDialog: false,
    openDeleteDialog: false,
    openAssignModal: false,
    deletePanelId: 0,
    candidatePrevRoundInfo: []
}

export const fetchInterviewPanels = createAsyncThunk('interviewPanel/fetchInterviewPanels', (seasonId) => {
    return axios
    .get(
        `${INTERVIEW_PANEL}?season_id=${seasonId}`,
        {
            withCredentials: true
        }
    )
    .then(response => response.data)
})

export const updatePanelCandidateOptions = createAsyncThunk('interviewPanel/updatePanelCandidateOptions', (panelRoundData) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?round_id=${panelRoundData['roundId']}&ready_for_interview=${true}`,
        {
            withCredentials: true
        }
    )
    .then(response => response.data)
})

export const updateInInterviewCandidateOptions = createAsyncThunk('interviewPanel/updateInInterviewCandidateOptions', (inInterviewRoundData) => {
    return axios
    .get(
        `${CANDIDATE_ROUND}?round_id=${inInterviewRoundData['roundId']}&interview_panel_id=${inInterviewRoundData['interviewPanelId']}`,
        {
            withCredentials: true
        }
    )
    .then(response => response.data)
})

// export const updatePanelRoundOptions = createAsyncThunk('interviewPanel/updatePanelRoundOptions', (panelRoundData) => {
//     return axios
//     .get(
//         `${CANDIDATE_ROUND}?candidate_id=${panelRoundData['candidateId']}`,
//         {
//             withCredentials: true
//         }
//     )
//     .then((response) => {
//         return response.data
//     })
// })

export const updateCandidateRoundInterviewPanel = createAsyncThunk('interviewPanel/updateCandidateRoundInterviewPanel', (candidateInterviewData) => {
    return axios
    .patch(
        `${CANDIDATE_ROUND}${candidateInterviewData['candidateRoundId']}/`,
        {
            interview_panel: candidateInterviewData['interviewPanelId'],
            status: 'interview'
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then(response => response.data)
})

export const createInterviewPanel = createAsyncThunk('interviewPanel/createInterviewPanel', (panelData) => {
    return axios
    .post(
        `${INTERVIEW_PANEL}`,
        {
            season_id: panelData['seasonId'],
            panel_name: panelData['panelName'],
            panelist: panelData['panelist'],
            location: panelData['location']
        },
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then(response => response.data)
})

export const deleteInterviewPanel = createAsyncThunk('interviewPanel/deleteInterviewPanel', (panelId) => {
    return axios
    .delete(
        `${INTERVIEW_PANEL}${panelId}/`,
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials:true
        }
    )
    .then(response => response.data)
})

export const fetchCandidateRoundsInfo = createAsyncThunk('interviewPanel/fetchCandidateRoundsInfo', (candidateSeasonData) => {
    return axios
    .get(
        `${SECTION_MARKS}?candidate_id=${candidateSeasonData['candidateId']}&season_id=${candidateSeasonData['seasonId']}`,
        {
            withCredentials: true
        }
    )
    .then(response => response.data)
})

const interviewPanelSlice = createSlice({
    name: 'interviewPanel',
    initialState,
    reducers: {
        openAssignInterviewPanelModal: (state,action) => {
            state.openAssignModal = action.payload['open']
            state.panel = action.payload['panel']
            state.panelCandidateList = action.payload['open']===false ? [] : state.panelCandidateList
        },
        openInterviewModal: (state,action) => {
            state.openInterviewModal = action.payload['open']
            state.panel = action.payload['panel']
            state.panelCandidateList = action.payload['open']===false ? [] : state.panelCandidateList
        },
        openCreateInterviewPanelDialog: (state,action) => {
            state.openCreatePanelDialog = action.payload
        },
        openInterviewPanelDeleteConfirmationDialog: (state,action) => {
            state.openDeleteDialog = action.payload['open']
            state.deletePanelId = action.payload['panelId']
        },
        updatePanelStatus: (state,action) => {
            state.panel['status'] = action.payload['status']
            state.panelList.forEach(panel => {
                if(panel['id']===action.payload['panel_id']) panel['status'] = action.payload['status']
            })
        },
        resetInterviewPanelState: (state) => {
            state.loading = false
            state.error = ''
            state.panel = {
                id: 0,
                season_id: 0,
                panel_name: '',
                panelist: [],
                location: '',
                status: '',
            }
            state.panelList = []
            state.openAssignModal = false
            state.panelRoundList = []
            state.panelCandidateList = []
            state.openInterviewModal = false
            state. candidatePrevRoundInfo = []
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
        // .addCase(updatePanelRoundOptions.pending, (state) => {
        //     state.loading = true
        // })
        // .addCase(updatePanelRoundOptions.fulfilled, (state,action) => {
        //     state.loading = false
        //     state.error = ''
        //     state.panelRoundList = action.payload.map(candidateRound => candidateRound['round_id'])
        // })
        // .addCase(updatePanelRoundOptions.rejected, (state,action) => {
        //     state.loading = false
        //     state.error = action.error.message
        //     console.log("Cannot update panel round list by candidate!")
        // })
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
        .addCase(updateInInterviewCandidateOptions.pending, (state) => {
            state.loading = true
        })
        .addCase(updateInInterviewCandidateOptions.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.panelCandidateList = action.payload
        })
        .addCase(updateInInterviewCandidateOptions.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Cannot update inInterview candidate options!")
        })
        .addCase(createInterviewPanel.pending, (state) => {
            state.loading = true
        })
        .addCase(createInterviewPanel.fulfilled, (state) => {
            state.loading = false
            state.error = ''
        })
        .addCase(createInterviewPanel.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Create interview panel unsuccessful!")
        })
        .addCase(deleteInterviewPanel.pending, (state) => {
            state.loading = true
        })
        .addCase(deleteInterviewPanel.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.openDeleteDialog = false
            state.deletePanelId = 0
        })
        .addCase(deleteInterviewPanel.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.openDeleteDialog = false
            state.deletePanelId = 0
            console.log("Delete interview panel unsuccessful!")
        })
        .addCase(fetchCandidateRoundsInfo.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidateRoundsInfo.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidatePrevRoundInfo = action.payload
        })
        .addCase(fetchCandidateRoundsInfo.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidatePrevRoundInfo = []
            console.log("Candidate round info fetch unsuccessful!")
        })
    }
})

export default interviewPanelSlice.reducer
export const { openAssignInterviewPanelModal, openInterviewModal, resetInterviewPanelState, openCreateInterviewPanelDialog, openInterviewPanelDeleteConfirmationDialog, updatePanelStatus } = interviewPanelSlice.actions