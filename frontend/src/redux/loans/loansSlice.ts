 import { createSlice } from '@reduxjs/toolkit';
import { borrowBookAsync, extendLoanAsync, returnBookAsync } from './loansThunks';

interface LoansState {
    borrowingLoading: boolean;
    borrowingError: string | null;
    extendingLoading: boolean;
    extendingError: string | null;
    returningLoading: boolean;
    returningError: string | null;
}

const initialLoansState: LoansState = {
    borrowingLoading: false,
    borrowingError: null,
    extendingLoading: false,
    extendingError: null,
    returningLoading: false,
    returningError: null,
};

const loansSlice = createSlice({
    name: 'loans',
    initialState: initialLoansState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(borrowBookAsync.pending, (state) => {
                state.borrowingLoading = true;
                state.borrowingError = null;
            })
            .addCase(borrowBookAsync.fulfilled, (state) => {
                state.borrowingLoading = false;
            })
            .addCase(borrowBookAsync.rejected, (state, action) => {
                state.borrowingLoading = false;
                state.borrowingError = action.payload as string || 'Errore generico nel prestito';
            })
            .addCase(extendLoanAsync.pending, (state) => {
                state.extendingLoading = true;
                state.extendingError = null;
            })
            .addCase(extendLoanAsync.fulfilled, (state) => {
                state.extendingLoading = false;
            })
            .addCase(extendLoanAsync.rejected, (state, action) => {
                state.extendingLoading = false;
                state.extendingError = action.payload as string || 'Errore generico nell\'estensione';
            })
            .addCase(returnBookAsync.pending, (state) => {
                state.returningLoading = true;
                state.returningError = null;
            })
            .addCase(returnBookAsync.fulfilled, (state) => {
                state.returningLoading = false;
            })
            .addCase(returnBookAsync.rejected, (state, action) => {
                state.returningLoading = false;
                state.returningError = action.payload as string || 'Errore generico nella restituzione';
            });
    },
});

export default loansSlice.reducer;
/**
 *
 */