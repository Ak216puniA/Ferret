import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
import seasonReducer from '../features/season/seasonSlice'
import seasonTabReducer from '../features/seasonTab/seasonTabSlice'
import logoutReducer from '../features/logout/logoutSlice'
import homeTabReducer from '../features/homeTab/homeTabSlice'
import seasonSubHeaderReducer from '../features/seasonSubHeader/seasonSubHeaderSlice'
import seasonRoundContentReducer from '../features/seasonRoundContent/seasonRoundContentSlice'
import questionReducer from '../features/question/questionSlice'
import questionSectionTabReducer from '../features/questionSectionTab/questionSectionTabSlice'

const store = configureStore({
    reducer: {
        login : loginReducer,
        season : seasonReducer,
        seasonTab : seasonTabReducer,
        logout : logoutReducer,
        homeTab : homeTabReducer,
        seasonSubHeader : seasonSubHeaderReducer,
        seasonRoundContent : seasonRoundContentReducer,
        question : questionReducer,
        questionSectionTab : questionSectionTabReducer
    },
})

export default store