import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
import seasonReducer from '../features/season/seasonSlice'
import navigationTabReducer from '../features/navigationTab/navigationTabSlice'
import logoutReducer from '../features/logout/logoutSlice'

const store = configureStore({
    reducer: {
        login : loginReducer,
        season : seasonReducer,
        navigationTab : navigationTabReducer,
        logout : logoutReducer
    },
})

export default store