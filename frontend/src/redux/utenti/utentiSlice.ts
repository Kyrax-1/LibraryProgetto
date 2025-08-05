import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchUtenti } from './utentiThunk'; // Importa il thunk per il recupero utenti

// Definisci il tipo per l'utente loggato (dovrebbe corrispondere alla risposta del tuo backend per l'autenticazione)
interface UserLoggedIn {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  role?: 'admin' | 'user';
}

// Definisci il tipo per un utente nella lista (dal thunk fetchUtenti)
export type UserListItem = {
  id: number;
  nomeCompleto: string;
};

// Definisci lo stato complessivo degli utenti
interface UtentiState {
  token: string | null;
  user: UserLoggedIn | null; // L'utente attualmente loggato
  isLoggedIn: boolean;
  loading: boolean; // Caricamento per operazioni di autenticazione e per fetchUtenti
  error: string | null; // Errore per operazioni di autenticazione e per fetchUtenti
  utenti: UserListItem[]; // Array per la lista di tutti gli utenti (dal fetchUtenti thunk)
  utentiLoading: boolean; // Loading specifico per fetchUtenti (se vuoi separare)
  utentiError: string | null; // Errore specifico per fetchUtenti (se vuoi separare)
}

// Inizializza lo stato recuperando il token e l'utente dal localStorage se esistono
const initialState: UtentiState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  isLoggedIn: !!localStorage.getItem('token'),
  loading: false, // Per auth operations
  error: null, // Per auth operations
  utenti: [], // Inizialmente vuoto
  utentiLoading: false, // Per fetchUtenti
  utentiError: null, // Per fetchUtenti
};

const utentiSlice = createSlice({
  name: "utenti",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: UserLoggedIn }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Puoi aggiungere qui reducers per errori o loading specifici se necessario per altre operazioni utente
  },
  extraReducers: (builder) => {
    builder
      // Gestione per fetchUtenti (recupero lista utenti)
      .addCase(fetchUtenti.pending, (state) => {
        state.utentiLoading = true;
        state.utentiError = null;
      })
      .addCase(fetchUtenti.fulfilled, (state, action: PayloadAction<UserListItem[]>) => {
        state.utentiLoading = false;
        state.utenti = action.payload; // Popola l'array degli utenti
      })
      .addCase(fetchUtenti.rejected, (state, action) => {
        state.utentiLoading = false;
        state.utentiError = action.payload as string || 'Errore nel recupero della lista utenti';
      });
  },
});

export const { loginSuccess, logout } = utentiSlice.actions; // Esporta le azioni se le usi
export default utentiSlice.reducer;