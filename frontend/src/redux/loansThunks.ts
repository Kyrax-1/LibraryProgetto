// loansThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateBookAsync } from './booksThunks'; // Importante: importiamo la thunk del booksSlice
import type { AppDispatch, RootState } from './store'; // Per il dispatch tra slices

// Tipo per i dati necessari a prestare un libro
export type BorrowBookPayload = {
    bookId: number;
    borrowerName: string;
};

export const borrowBookAsync = createAsyncThunk<void,BorrowBookPayload,{ dispatch: AppDispatch; state: RootState }>( /* Questa thunk non deve necessariamente restituire un payload al loansSlice, perché l'aggiornamento reale avverrà nel booksSlice */
  'loans/borrowBook',
  async ({ bookId, borrowerName }, { dispatch, rejectWithValue }) => {
    try {
      const today = new Date();
      const expirationDate = new Date();
      expirationDate.setMonth(today.getMonth() + 1);

      const newLoanExpir = expirationDate.toISOString().split('T')[0];
      const newLoanDate = today.toISOString().split('T')[0];

      // 1. Dispatcha la thunk del booksSlice per aggiornare il libro sul server e nel booksSlice
      const resultAction = await dispatch(updateBookAsync({
        id: bookId,
        updates: {
          isAvailable: false,
          borrowerName: borrowerName,
          loanDate: newLoanDate,
          loanExpir: newLoanExpir,
        }
      }));

      // Controlla se l'aggiornamento del libro è andato a buon fine
      if (updateBookAsync.rejected.match(resultAction)) {
          // Se la thunk di aggiornamento libro ha fallito, propaga l'errore
          throw new Error(resultAction.payload as string || 'Errore nell\'aggiornamento del libro');
      }

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk per estendere un prestito
export const extendLoanAsync = createAsyncThunk<void,{ bookId: number; currentLoanExpir: string },  { dispatch: AppDispatch; state: RootState }>(/* Non restituisce un payload diretto al loansSlice prende l'ID del libro e la data di scadenza attuale */
  'loans/extendLoan',
  async ({ bookId, currentLoanExpir }, { dispatch, rejectWithValue }) => {
    try {
      const currentExpirDate = new Date(currentLoanExpir);
      currentExpirDate.setMonth(currentExpirDate.getMonth() + 1); // Estendi di un mese
      const newLoanExpir = currentExpirDate.toISOString().split('T')[0];

      const resultAction = await dispatch(updateBookAsync({
        id: bookId,
        updates: { loanExpir: newLoanExpir }
      }));

      if (updateBookAsync.rejected.match(resultAction)) {
          throw new Error(resultAction.payload as string || 'Errore nell\'estensione del prestito');
      }

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk per restituire un libro
export const returnBookAsync = createAsyncThunk<void,number, { dispatch: AppDispatch; state: RootState }>( // Non restituisce un payload diretto al loansSlice prende l'ID del libro da restituire
  'loans/returnBook',
  async (bookId, { dispatch, rejectWithValue }) => {
    try {
      const resultAction = await dispatch(updateBookAsync({
        id: bookId,
        updates: {
          isAvailable: true,
          borrowerName: null,
          loanDate: null,
          loanExpir: null,
        }
      }));
      if (updateBookAsync.rejected.match(resultAction)) {
          throw new Error(resultAction.payload as string || 'Errore nella restituzione del libro');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);