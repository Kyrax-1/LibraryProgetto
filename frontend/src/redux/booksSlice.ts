import { createSlice } from '@reduxjs/toolkit';
import { addBookAsync, deleteBookAsync, fetchBooks, updateBookAsync } from './booksThunks';

export type Book = {            // crep il tipo book
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
  borrowerName: string | null;
  loanDate: string | null;
  loanExpir: string | null;
};

type BooksState = {
  items: Book[];
  loading: boolean;
  error: string | null;
};

const initialState: BooksState = {
  items: [],
  loading: false,
  error: null
};        // stato iniziale del Film

const booksSlice = createSlice({                 //creo lo slice
  name: 'books',                               // nome dello slice
  initialState,                       //prendo lo stato iniziale dalla costante creata
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore nel fetch';
      })
      .addCase(addBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore nell\'aggiunta';
      })
      // EXTRA REDUCERS PER updateBookAsync
      .addCase(updateBookAsync.pending, (state) => {
        state.loading = true; // Potresti voler un loading più specifico per singolo libro
        state.error = null;
      })
      .addCase(updateBookAsync.fulfilled, (state, action) => {
        const updatedBook = action.payload;
        const index = state.items.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
          state.items[index] = updatedBook; // Sostituisci il libro con la versione aggiornata dal server
        }
        state.loading = false;
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore nell\'aggiornamento del libro';
      })
      // EXTRA REDUCERS PER deleteBookAsync
      .addCase(deleteBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(book => book.id !== action.payload); // Rimuovi il libro dallo stato
        state.loading = false;
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Errore nell\'eliminazione del libro';
      });
  }
});

// esporto il reducer e le sue actions

export default booksSlice.reducer;
