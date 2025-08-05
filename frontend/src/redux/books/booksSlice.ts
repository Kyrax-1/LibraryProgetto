import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { addBookAsync, deleteBookAsync, fetchBooks, updateBookAsync, fetchBookLoan } from './booksThunks';

export type Book = {
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
  loanId?: number; // Opzionale, se il libro è in prestito
  borrowerName?: string | null; // Opzionale
  loanDate?: string | null; // Opzionale
  loanExpir?: string | null; // Opzionale
};

type BooksState = {
  items: Book[];
  loading: boolean;
  error: string | null;
  currentLoan: { // Questo è lo stato per i dettagli di un singolo prestito di un libro
    loading: boolean;
    error: string | null;
    // Potresti voler aggiungere qui i dettagli del prestito recuperato da fetchBookLoan
    // ad esempio: loanDetails: { bookId: number; borrowerName: string; loanDate: string; loanExpir: string } | null;
  };
};

const initialState: BooksState = {      //stato iniziale
  items: [],
  loading: false,
  error: null,
  currentLoan: {
    loading: false,
    error: null
  }
};


const booksSlice = createSlice({                 //creo lo slice
  name: 'books',                               // nome dello slice
  initialState,                       //prendo lo stato iniziale dalla costante creata
  reducers: {},
  extraReducers: (builder) => {
    builder
      // EXTRA REDUCERS PER fetchBooks
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore nel recupero dei libri';
      })
      // EXTRA REDUCERS PER addBookAsync
      .addCase(addBookAsync.pending, (state) => {
        state.loading = true; // Potresti voler un loading più specifico per l'aggiunta
        state.error = null;
      })
      .addCase(addBookAsync.fulfilled, (state, action: PayloadAction<Book>) => {
        state.items.push(action.payload); // Aggiungi il nuovo libro allo stato
        state.loading = false;
      })
      .addCase(addBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore nell\'aggiunta del libro';
      })
      // EXTRA REDUCERS PER updateBookAsync
      .addCase(updateBookAsync.pending, (state) => {
        state.loading = true; // Potresti voler un loading più specifico per singolo libro
        state.error = null;
      })
      .addCase(updateBookAsync.fulfilled, (state, action: PayloadAction<Book>) => {
        console.log("Libro aggiornato nel reducer:", action.payload);
        const updatedBook = action.payload;
        const index = state.items.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
          state.items[index] = updatedBook; // Sostituisci il libro con la versione aggiornata dal server
        }
        state.loading = false;
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore nell\'aggiornamento del libro';
      })
      // EXTRA REDUCERS PER deleteBookAsync
      .addCase(deleteBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(book => book.id !== action.payload); // Rimuovi il libro dallo stato
        state.loading = false;
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore nell\'eliminazione del libro';
      })
      // EXTRA REDUCERS PER fetchBookLoan (gestione del prestito di un singolo libro)
      .addCase(fetchBookLoan.pending, (state) => {
        state.currentLoan.loading = true;
        state.currentLoan.error = null;
      })
      .addCase(fetchBookLoan.fulfilled, (state, action) => {
        state.currentLoan.loading = false;
        // Aggiorna lo stato del libro specifico con le info sul prestito
        const bookId = action.payload?.bookId; // payload può essere null se non c'è prestito
        if (bookId) {
          const index = state.items.findIndex(book => book.id === bookId);
          if (index !== -1) {
            state.items[index] = {
              ...state.items[index],
              loanId: action.payload?.id,
              borrowerName: action.payload?.borrowerName,
              loanDate: action.payload?.loanDate,
              loanExpir: action.payload?.loanExpir,
              isAvailable: action.payload === null, // Se c'è un payload di prestito, non è disponibile
            };
            // Se il payload è null, significa che il prestito è terminato
            if (action.payload === null) {
              state.items[index].isAvailable = true;
              state.items[index].loanId = undefined;
              state.items[index].borrowerName = null;
              state.items[index].loanDate = null;
              state.items[index].loanExpir = null;
            } else {
              state.items[index].isAvailable = false;
            }
          }
        }
      })
      .addCase(fetchBookLoan.rejected, (state, action) => {
        state.currentLoan.loading = false;
        state.currentLoan.error = action.payload as string || 'Errore nel recupero del prestito del libro';
      });
  },
});

export default booksSlice.reducer;