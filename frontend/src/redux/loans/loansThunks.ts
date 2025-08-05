// src/redux/loans/loansThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchBooks } from './../books/booksThunks';
import type { AppDispatch, RootState } from './../store';
import type { Loan } from './loansSlice';
import axiosInstance from '../../services/api';

// Tipi per gli errori API
type ApiErrorResponse = {
  error?: string;
  message?: string;
  code?: string;
};

// Tipo per i dati necessari a prestare un libro
export type BorrowBookPayload = {
  bookId: number;
  borrowerName: string;
  userId: number;
  loanDate: string;
  loanExpir: string;
};

const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Errore sconosciuto';
};

// Prestare un libro
export const borrowBookAsync = createAsyncThunk<
  void,
  BorrowBookPayload,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(
  'loans/borrowBook',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post('/book/loan', payload);

      await dispatch(fetchBooks());
      await dispatch(fetchLoansAsync());
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Estendere un prestito
export const extendLoanAsync = createAsyncThunk<
  void,
  { loanId: number },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(
  'loans/extendLoan',
  async ({ loanId }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/book/loan/${loanId}/extend`);

      await dispatch(fetchBooks());
      await dispatch(fetchLoansAsync());
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Restituire un libro
export const returnBookAsync = createAsyncThunk<
  void,
  { loanId: number },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(
  'loans/returnBook',
  async ({ loanId }: { loanId: number }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/book/loan/${loanId}`);

      await dispatch(fetchBooks());
      await dispatch(fetchLoansAsync());
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);


export const fetchLoansAsync = createAsyncThunk<
  Loan[],
  void,
  {
    rejectValue: string;
  }
>(
  'loans/fetchLoans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Loan[]>('/loans');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchUserLoansAsync = createAsyncThunk<
  Loan[],
  number,
  {
    rejectValue: string;
  }
>(
  'loans/fetchUserLoans',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Loan[]>(`/loans/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);