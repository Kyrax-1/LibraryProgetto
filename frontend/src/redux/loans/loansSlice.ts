import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { borrowBookAsync, extendLoanAsync, returnBookAsync, fetchLoansAsync, fetchUserLoansAsync } from './loansThunks';

// Definisci il tipo per un singolo prestito
export type Loan = {
    loanId: number;
    bookId: number;
    title: string;
    author: string;
    borrowerName: string;
    loanDate: string; // Formato 'DD-MM-YYYY'
    loanExpir: string; // Formato 'DD-MM-YYYY'
    userId: number;
};

interface LoansState {
    items: Loan[]; // Aggiunto per memorizzare tutti i prestiti o i prestiti dell'utente
    loading: boolean; // Loading generale per fetchLoansAsync e fetchUserLoansAsync
    error: string | null; // Error generale per fetchLoansAsync e fetchUserLoansAsync
    borrowingLoading: boolean;
    borrowingError: string | null;
    extendingLoading: boolean;
    extendingError: string | null;
    returningLoading: boolean;
    returningError: string | null;
}

const initialLoansState: LoansState = {
    items: [],
    loading: false,
    error: null,
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
            // Azioni per borrowBookAsync
            .addCase(borrowBookAsync.pending, (state) => {
                state.borrowingLoading = true;
                state.borrowingError = null;
            })
            .addCase(borrowBookAsync.fulfilled, (state) => {
                state.borrowingLoading = false;
                // Non è necessario manipolare lo stato 'items' qui direttamente
                // Poiché fetchLoansAsync o fetchUserLoansAsync verranno dispatchati
            })
            .addCase(borrowBookAsync.rejected, (state, action) => {
                state.borrowingLoading = false;
                state.borrowingError = action.payload as string || 'Errore generico nel prestito';
            })
            // Azioni per extendLoanAsync
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
            // Azioni per returnBookAsync
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
            })
            // Azioni per fetchLoansAsync (recupera tutti i prestiti)
            .addCase(fetchLoansAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLoansAsync.fulfilled, (state, action: PayloadAction<Loan[]>) => {
                state.loading = false;
                state.items = action.payload; // Aggiorna lo stato con tutti i prestiti
            })
            .addCase(fetchLoansAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Errore nel recupero dei prestiti';
            })
            // Azioni per fetchUserLoansAsync (recupera prestiti di un utente)
            .addCase(fetchUserLoansAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserLoansAsync.fulfilled, (state, action: PayloadAction<Loan[]>) => {
                state.loading = false;
                state.items = action.payload; // Aggiorna lo stato con i prestiti dell'utente
            })
            .addCase(fetchUserLoansAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Errore nel recupero dei prestiti dell\'utente';
            });
    },
});

export default loansSlice.reducer;