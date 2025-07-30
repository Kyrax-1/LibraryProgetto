import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchBookLoan } from './../books/booksThunks';
import type { AppDispatch, RootState } from './../store';

// Tipi per gli errori API
type ApiErrorResponse = {
  error?: string;
  message?: string;
  code?: string;
};

type CustomError = Error & {
  response?: {
    data?: ApiErrorResponse;
  };
};

// Tipo per i dati necessari a prestare un libro
export type BorrowBookPayload = {
  bookId: number;
  borrowerName: string;
  userId: number;
};

// Funzione helper per gestire gli errori
const handleApiError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    const customError = error as CustomError;
    if (customError.response?.data?.error) {
      return customError.response.data.error;
    }
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
  async ({ bookId, borrowerName, userId }, { dispatch, rejectWithValue }) => {
    try {
      const today = new Date();
      const expirationDate = new Date();
      expirationDate.setMonth(today.getMonth() + 1);

      const res = await fetch('/api/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LibroID: bookId,
          UtenteID: userId,
          borrowerName,
          loanDate: today.toISOString().split('T')[0],
          loanExpir: expirationDate.toISOString().split('T')[0]
        }),
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        throw new Error(errorData.error || 'Errore nell\'avvio del prestito');
      }

      await dispatch(fetchBookLoan(bookId));
    } catch (error) {
      return rejectWithValue(handleApiError(error));
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
      const res = await fetch(`/api/loan/${loanId}/extend`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        throw new Error(errorData.error || 'Errore nell\'estensione del prestito');
      }

      await dispatch(fetchBooks());
    } catch (error) {
      return rejectWithValue(handleApiError(error));
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
      const res = await fetch(`/api/loan/${loanId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        throw new Error(errorData.error || 'Errore nella restituzione del libro');
      }

      await dispatch(fetchBooks());
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);