import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'
// import { createLogger } from 'redux-logger'

// const logger = createLogger()

const store = configureStore({
    reducer: {
        login : loginReducer
    },
    // middleware: ()
})

export default store