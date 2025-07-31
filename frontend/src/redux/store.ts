import { configureStore } from "@reduxjs/toolkit";
import booksReducer from './books/booksSlice';
import loansReducer from './loans/loansSlice';
import utenteSlice from './utenti/utentiSlice';

const store = configureStore({
  reducer: {
    books: booksReducer,
    loans: loansReducer,
    utenti: utenteSlice
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


