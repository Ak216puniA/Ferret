import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { CANDIDATES, CANDIDATE_SECTION_MARKS, SECTION_MARKS, CANDIDATE_MARKS, QUESTIONS } from '../../urls'
import Cookies from "js-cookie";

const initialState = {
    loading: false,
    error: '',
    open_candidate_modal: false,
    candidate_id: 0,
    candidate: [],
    candidate_section_marks: [],
    candidate_question_data: [],
    section_name: '',
    section_id: 0,
    interviewQuestionsChanged: false,
    openDeleteDialog: false,
    deleteQuestionId: 0
}

export const fetchCandidate = createAsyncThunk('candidateModal/fetchCandidate', (candidate_id) => {
    return axios
    .get(
        `${CANDIDATES}${candidate_id}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const fetchSelectedCandidateSectionMarks = createAsyncThunk('candidateModal/fetchSelectedCandidateSectionMarks', (requestData) => {
    return axios
    .post(
        `${SECTION_MARKS}`,
        {
            candidate_list: requestData['candidate_list'],
            section_list: requestData['section_list'],
        },
        {
            headers: {
                "X-CSRFToken": Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const fetchQuestionWiseCandidateSectionMarks = createAsyncThunk('candidateModal/fetchQuestionWiseCandidateSectionMarks', (requestData) => {
    return axios
    .get(
        `${CANDIDATE_SECTION_MARKS}?candidate_id=${requestData['candidate_id']}&section_id=${requestData['section_id']}`,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const updateCandidateQuestionMarks = createAsyncThunk('candidateModal/updateCandidateQuestionMarks', (candidateQuestionData) => {
    return axios
    .patch(
        `${CANDIDATE_MARKS}${candidateQuestionData['id']}/`,
        {
            marks: candidateQuestionData['marks'],
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

export const updateCandidateQuestionStatus = createAsyncThunk('candidateModal/updateCandidateQuestionStatus', (candidateQuestionData) => {
    return axios
    .patch(
        `${CANDIDATE_MARKS}${candidateQuestionData['id']}/`,
        {
            status: 'checked',
            remarks: candidateQuestionData['remarks']
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

export const createCandidateInterviewQuestion = createAsyncThunk('candidateModal/createCandidateInterviewQuestion', (questionData) => {
    return axios
    .post(
        `${QUESTIONS}`,
        {
            candidate_id: questionData['candidate_id'],
            section_id: questionData['section_id'],
            text: questionData['questionText'],
            marks: questionData['questionMarks'],
            total_marks: questionData['questionTotalMarks'],
            remarks: questionData['questionRemarks']
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

export const deleteCandidateInterviewQuestion = createAsyncThunk('candidateModal/deleteCandidateInterviewQuestion', (questionData) => {
    return axios
    .delete(
        `${CANDIDATE_MARKS}${questionData['candidateMarksId']}`,
        {
            headers: {
                "X-CSRFToken":Cookies.get('ferret_csrftoken'),
            },
            withCredentials: true
        }
    )
    .then((response) => {
        return response.data
    })
})

export const chooseCandidateInterviewQuestion = createAsyncThunk('candidateModal/chooseCandidateInterviewQuestion', (candidateQuestionData) => {
    return axios
    .post(
        `${CANDIDATE_MARKS}`,
        {
            candidate_id: candidateQuestionData['candidateId'],
            question_id: candidateQuestionData['questionId']
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

const candidateModalSlice = createSlice({
    name: 'candidateModal',
    initialState,
    reducers: {
        openCandidateModal: (state,action) => {
            state.open_candidate_modal = action.payload['open']
            state.candidate_id = action.payload['candidate_id']
        },
        selectSection: (state,action) => {
            state.section_name = action.payload['section_name']
            state.section_id = action.payload['section_id']
        },
        updatedCandidateSectionQuestionList: (state) => {
            state.interviewQuestionsChanged = false
        },
        openDeleteCofirmationDialog: (state,action) => {
            state.openDeleteDialog = action.payload['open']
            state.deleteQuestionId = action.payload['questionId']
        },
        resetCandidateModalState: (state) => {
            state.loading = false
            state.error = ''
            state.open_candidate_modal = false
            state.candidate_id = 0
            state.candidate = []
            state.candidate_section_marks = []
            state.candidate_question_data = []
            state.section_name = ''
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchCandidate.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCandidate.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate = action.payload
        })
        .addCase(fetchCandidate.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate = []
        })
        .addCase(fetchSelectedCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchSelectedCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_section_marks = action.payload['data'][0]
        })
        .addCase(fetchSelectedCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_section_marks = []
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.fulfilled, (state,action) => {
            state.loading = false
            state.error = ''
            state.candidate_question_data = action.payload
        })
        .addCase(fetchQuestionWiseCandidateSectionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.candidate_question_data = []
        })
        .addCase(updateCandidateQuestionMarks.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCandidateQuestionMarks.fulfilled, (state) => {
            state.loading = false
            state.error = ''
        })
        .addCase(updateCandidateQuestionMarks.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidate question's marks update unsucessful!")
        })
        .addCase(updateCandidateQuestionStatus.pending, (state) => {
            state.loading = true
        })
        .addCase(updateCandidateQuestionStatus.fulfilled, (state) => {
            state.loading = false
            state.error = ''
        })
        .addCase(updateCandidateQuestionStatus.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            console.log("Candidate question's status update unsucessful!")
        })
        .addCase(createCandidateInterviewQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(createCandidateInterviewQuestion.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.interviewQuestionsChanged = true
        })
        .addCase(createCandidateInterviewQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.interviewQuestionsChanged = false
            console.log("Interview candidate question not created!")
        })
        .addCase(deleteCandidateInterviewQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(deleteCandidateInterviewQuestion.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.interviewQuestionsChanged = true
            state.openDeleteDialog = false
            state.deleteQuestionId = 0
        })
        .addCase(deleteCandidateInterviewQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.interviewQuestionsChanged = false
            state.openDeleteDialog = false
            state.deleteQuestionId = 0
            console.log("Interview candidate question not deleted!")
        })
        .addCase(chooseCandidateInterviewQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(chooseCandidateInterviewQuestion.fulfilled, (state) => {
            state.loading = false
            state.error = ''
            state.interviewQuestionsChanged = true
        })
        .addCase(chooseCandidateInterviewQuestion.rejected, (state,action) => {
            state.loading = false
            state.error = action.error.message
            state.interviewQuestionsChanged = false
            console.log("Cannot choose candidate interview!")
        })
    }
})

export default candidateModalSlice.reducer
export const { openCandidateModal, selectSection, resetCandidateModalState, updatedCandidateSectionQuestionList, openDeleteCofirmationDialog } = candidateModalSlice.actions