import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './features/contactSlice'
import messageReducer from './features/messageSlice'

const store = configureStore({
  reducer: {
    contact: contactReducer ,
    message:messageReducer,
  },
})

export default store