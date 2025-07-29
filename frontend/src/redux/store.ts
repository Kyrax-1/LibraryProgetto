import { configureStore } from "@reduxjs/toolkit";
import booksReducer from './booksSlice';
import loansUIReducer from './loansSlice';

const store = configureStore({
  reducer: {
    book: booksReducer,
    loansUI: loansUIReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;