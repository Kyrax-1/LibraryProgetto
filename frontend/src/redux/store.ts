import { configureStore } from "@reduxjs/toolkit";
import booksReducer from './books/booksSlice';
import loansReducer from './loans/loansSlice';

const store = configureStore({
  reducer: {
    books: booksReducer,
    loans: loansReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;