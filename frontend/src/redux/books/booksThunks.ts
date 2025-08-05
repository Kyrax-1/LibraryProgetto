import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Importa Axios
import type { Book } from './booksSlice';
import axiosInstance from './../../services/api';

// Funzione helper per gestire gli errori di Axios (riutilizzabile)
const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Errore dal server (es. 400, 404, 500)
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    // Messaggio di errore generico di Axios
    return error.message;
  }
  // Errore non Axios
  if (error instanceof Error) {
    return error.message;
  }
  return 'Errore sconosciuto';
};

// Fetch libri
export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>(
  'books/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Book[]>('/book');
      return response.data; // Axios restituisce i dati direttamente in .data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Fetch prestiti specifici per un libro (se necessario per lo stato del libro)
export const fetchBookLoan = createAsyncThunk<
  { id: number; bookId: number; borrowerName: string; loanDate: string; loanExpir: string } | null,
  number,
  { rejectValue: string }
>(
  'books/fetchLoan',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ id: number; bookId: number; borrowerName: string; loanDate: string; loanExpir: string }>(`/book/${bookId}/loan`);
      // Se la risposta è 200 ma non ci sono dati o è un array vuoto, restituisci null
      if (response.status === 204 || !response.data) { // Esempio: il server risponde 204 No Content se non c'è prestito
        return null;
      }
      return { ...response.data, bookId }; // Axios restituisce i dati direttamente in .data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Il libro non ha un prestito associato
      }
      return rejectWithValue(handleAxiosError(error));
    }
  }
);


// Chiamata per aggiungere libri
export const addBookAsync = createAsyncThunk<Book, { author: string; title: string }, { rejectValue: string }>(
  'books/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Book>('/book', {
        ...bookData,
        isAvailable: true // Questo campo viene gestito dal frontend come sempre disponibile all'aggiunta
      });
      return response.data; // Axios restituisce i dati direttamente in .data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Update book (SOLO per dati del libro, non prestiti)
export const updateBookAsync = createAsyncThunk<Book, { id: number; updates: { title?: string; author?: string } }, { rejectValue: string }>(
  'books/updateBook',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<Book>(`/book/${id}`, updates);
      console.log("Dati aggiornati dal server:", response.data);
      return response.data; // Axios restituisce i dati direttamente in .data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// THUNK PER L'ELIMINAZIONE DI UN LIBRO
export const deleteBookAsync = createAsyncThunk<number, number, { rejectValue: string }>(
  'books/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/book/${bookId}`);
      return bookId; // Restituisce l'ID del libro eliminato per aggiornare lo stato
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);