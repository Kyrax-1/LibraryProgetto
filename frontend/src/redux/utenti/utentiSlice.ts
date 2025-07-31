// src/features/utenti/utenteSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchUtenti } from './utentiThunk';

type Utente = {
  id: number;
  nomeCompleto: string;
};

type UtentiState = {
  utenti: Utente[];
  loading: boolean;
  error: string | null;
};

const initialState: UtentiState = {
  utenti: [],
  loading: false,
  error: null,
};

const utenteSlice = createSlice({
  name: 'utenti',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUtenti.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUtenti.fulfilled, (state, action) => {
        state.loading = false;
        state.utenti = action.payload;
      })
      .addCase(fetchUtenti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Errore sconosciuto';
      });
  },
});

export default utenteSlice.reducer;
