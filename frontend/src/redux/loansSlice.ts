import { createSlice } from '@reduxjs/toolkit';
import { borrowBookAsync, extendLoanAsync, returnBookAsync } from './loansThunks';

interface LoansUIState {
    borrowingLoading: boolean;
    borrowingError: string | null;
    extendingLoading: boolean;
    extendingError: string | null;
    returningLoading: boolean;
    returningError: string | null;
}

const initialLoansUIState: LoansUIState = {
    borrowingLoading: false,
    borrowingError: null,
    extendingLoading: false,
    extendingError: null,
    returningLoading: false,
    returningError: null,
};

const loansUISlice = createSlice({
    name: 'loansUI',
    initialState: initialLoansUIState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Gestione del borrowing
            .addCase(borrowBookAsync.pending, (state) => {
                state.borrowingLoading = true;
                state.borrowingError = null;
            })
            .addCase(borrowBookAsync.fulfilled, (state) => {
                state.borrowingLoading = false;
                state.borrowingError = null; // Reset errore al successo
            })
            .addCase(borrowBookAsync.rejected, (state, action) => {
                state.borrowingLoading = false;
                state.borrowingError = action.payload as string || 'Errore generico nel prestito';
            })
            // Gestione dell'estensione
            .addCase(extendLoanAsync.pending, (state) => {
                state.extendingLoading = true;
                state.extendingError = null;
            })
            .addCase(extendLoanAsync.fulfilled, (state) => {
                state.extendingLoading = false;
                state.extendingError = null;
            })
            .addCase(extendLoanAsync.rejected, (state, action) => {
                state.extendingLoading = false;
                state.extendingError = action.payload as string || 'Errore generico nell\'estensione';
            })
            // Gestione della restituzione
            .addCase(returnBookAsync.pending, (state) => {
                state.returningLoading = true;
                state.returningError = null;
            })
            .addCase(returnBookAsync.fulfilled, (state) => {
                state.returningLoading = false;
                state.returningError = null;
            })
            .addCase(returnBookAsync.rejected, (state, action) => {
                state.returningLoading = false;
                state.returningError = action.payload as string || 'Errore generico nella restituzione';
            });
    },
});

export default loansUISlice.reducer;