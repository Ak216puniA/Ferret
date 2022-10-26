import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
import seasonReducer from '../features/season/seasonSlice'
import navigationTabReducer from '../features/navigationTab/navigationTabSlice'

const store = configureStore({
    reducer: {
        login : loginReducer,
        season : seasonReducer,
        navigationTab : navigationTabReducer
    },
})

export default store