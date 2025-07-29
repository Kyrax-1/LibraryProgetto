import { createAsyncThunk } from '@reduxjs/toolkit';
import {type Book } from './booksSlice';

// createAsyncThunk crea automaticamente le action: pending / fulfilled / rejected
export const fetchBooks = createAsyncThunk<Book[]>(
  'books/fetchAll',
  async () => {
    const res = await fetch('/api/book');
    if (!res.ok) throw new Error('Errore nel fetch dei books');
    const data = await res.json();
    return data; // deve essere un array di Books
  }
);

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
        isAvailable: true,
        borrowerName: null,
        loanDate: null,
        loanExpir: null
      }),
    });
    
    if (!res.ok) throw new Error('Errore nell\'aggiunta del libro');
    const data = await res.json();
    return data;
  }
);

// NUOVA THUNK PER L'AGGIORNAMENTO GENERALE DI UN LIBRO
export const updateBookAsync = createAsyncThunk<Book,{ id: number; updates: Partial<Book>}>(
  'books/updateBook',
  async ({ id, updates }) => {
    const res = await fetch(`/api/book/${id}`, { // Endpoint per aggiornare un libro specifico
      method: 'PATCH', // Usiamo PATCH per aggiornare parzialmente la risorsa
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates), // Invia solo i campi che vuoi aggiornare
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Errore nell\'aggiornamento del libro');
    }
    const data = await res.json();
    return data; // Il server dovrebbe restituire il libro aggiornato
  }
);

// NUOVA THUNK PER L'ELIMINAZIONE DI UN LIBRO
export const deleteBookAsync = createAsyncThunk<number, number>( // Restituisce l'ID del libro eliminato, prende l'ID come input
  'books/deleteBook',
  async (bookId) => {
    const res = await fetch(`/api/book/${bookId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Errore nell\'eliminazione del libro');
    }
    return bookId; // Restituisci l'ID per sapere quale libro rimuovere dallo stato
  }
);