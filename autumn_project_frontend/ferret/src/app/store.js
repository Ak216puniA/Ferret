import { configureStore } from '@reduxjs/toolkit'
import seasonReducer from '../features/season/seasonSlice'
import seasonTabReducer from '../features/seasonTab/seasonTabSlice'
import logoutReducer from '../features/logout/logoutSlice'
import homeTabReducer from '../features/homeTab/homeTabSlice'
import seasonSubHeaderReducer from '../features/seasonSubHeader/seasonSubHeaderSlice'
import seasonRoundContentReducer from '../features/seasonRoundContent/seasonRoundContentSlice'
import questionReducer from '../features/question/questionSlice'
import questionSectionTabReducer from '../features/questionSectionTab/questionSectionTabSlice'
import userReducer from '../features/user/userSlice'

const store = configureStore({
    reducer: {
        season : seasonReducer,
        seasonTab : seasonTabReducer,
        logout : logoutReducer,
        homeTab : homeTabReducer,
        seasonSubHeader : seasonSubHeaderReducer,
        seasonRoundContent : seasonRoundContentReducer,
        question : questionReducer,
        questionSectionTab : questionSectionTabReducer,
        user : userReducer
    },
})

export default store