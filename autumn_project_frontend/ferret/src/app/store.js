import { configureStore } from '@reduxjs/toolkit'
import seasonReducer from '../features/season/seasonSlice'
import roundTabReducer from '../features/roundTab/roundTabSlice'
import logoutReducer from '../features/logout/logoutSlice'
import homeTabReducer from '../features/homeTab/homeTabSlice'
import seasonSubHeaderReducer from '../features/seasonSubHeader/seasonSubHeaderSlice'
import seasonRoundContentReducer from '../features/seasonRoundContent/seasonRoundContentSlice'
import questionReducer from '../features/question/questionSlice'
import sectionTabReducer from '../features/sectionTab/sectionTabSlice'
import userReducer from '../features/user/userSlice'
import roundReducer from '../features/round/roundSlice'
import candidateModalReducer from '../features/candidateModal/candidateModalSlice'
import filterReducer from '../features/filter/filterSlice'
import interviewPanelReducer from '../features/interviewPanel/interviewPanelSlice'

const store = configureStore({
    reducer: {
        season : seasonReducer,
        roundTab : roundTabReducer,
        logout : logoutReducer,
        homeTab : homeTabReducer,
        seasonSubHeader : seasonSubHeaderReducer,
        seasonRoundContent : seasonRoundContentReducer,
        question : questionReducer,
        sectionTab : sectionTabReducer,
        user : userReducer,
        round : roundReducer,
        candidateModal : candidateModalReducer,
        filter : filterReducer,
        interviewPanel : interviewPanelReducer
    },
})

export default store