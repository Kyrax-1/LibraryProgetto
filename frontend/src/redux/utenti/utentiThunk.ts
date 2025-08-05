// src/redux/utenti/utentiThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Mantiene questo per axios.isAxiosError
import axiosInstance from '../../services/api'; // <--- ASSICURATI CHE IL PERCORSO SIA CORRETTO

// Definisci il tipo per un utente che viene recuperato
export type UserListItem = {
  id: number;
  nomeCompleto: string;
};

// Funzione helper per gestire gli errori di Axios
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

export const fetchUtenti = createAsyncThunk<UserListItem[], void, { rejectValue: string }>(
  'utenti/fetchUtenti',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<any[]>('/users');
      const data = response.data;

      // Mappa i dati per restituire solo UtenteID e Nome + Cognome
      return data.map((utente: any) => ({
        id: utente.id,
        nomeCompleto: `${utente.nome} ${utente.cognome}`,
      }));
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);