import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Book } from './booksSlice';

//Fetch libri
export const fetchBooks = createAsyncThunk<Book[]>(
  'books/fetchAll',
  async () => {
    const res = await fetch('/api/book');
    if (!res.ok) throw new Error('Errore nel fetch dei books');
    return await res.json();
  }
);

//Fetch prestiti
export const fetchBookLoan = createAsyncThunk<
  { id: number; bookId: number; borrowerName: string; loanDate: string; loanExpir: string },number
>(
  'books/fetchLoan',
  async (bookId) => {
    const res = await fetch(`/api/book/${bookId}/loan`);
    if (!res.ok) return null;
    const loan = await res.json();
    return loan ? { ...loan, bookId } : null;
  }
);

// Chiamata per aggiungere libri
export const addBookAsync = createAsyncThunk<Book, { author: string, title: string }>(
  'books/addBook',
  async (bookData) => {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bookData,
        isAvailable: true // Solo questo campo, gli altri sono gestiti dal database
      }),
    });
    
    if (!res.ok) throw new Error('Errore nell\'aggiunta del libro');
    const data = await res.json();
    return data;
  }
);

// Update book (SOLO per dati del libro, non prestiti)
export const updateBookAsync = createAsyncThunk<Book,{ id: number; updates: { title?: string; author?: string } }>(
  'books/updateBook',
  async ({ id, updates }) => {
    const res = await fetch(`/api/book/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Errore nell\'aggiornamento del libro');
    }
    const data = await res.json();
    return data;
  }
);
 

//THUNK PER L'ELIMINAZIONE DI UN LIBRO


export const deleteBookAsync = createAsyncThunk<number, number>(
  'books/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/book/${bookId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.details || errorData.error);
      }

      return bookId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Errore sconosciuto durante l\'eliminazione del libro');
    }
  }
);