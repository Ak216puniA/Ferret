import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
import seasonReducer from '../features/season/seasonSlice'
import seasonTabReducer from '../features/seasonTab/seasonTabSlice'
import logoutReducer from '../features/logout/logoutSlice'

const store = configureStore({
    reducer: {
        login : loginReducer,
        season : seasonReducer,
        seasonTab : seasonTabReducer,
        logout : logoutReducer
    },
})

export default store