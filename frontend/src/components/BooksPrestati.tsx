import { useEffect } from "react";
import { fetchBooks } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItemPrestato from "./BookItemPrestato";

export default function BookPrestati() {
  const dispatch = useAppDispatch();

  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);
  const error = useAppSelector((state) => state.books.error);

const filteredBooks = books.filter(book => !book.isAvailable && book.loanId);
  

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <>
      {loading && (
        <p className="text-blue-500 animate-pulse text-sm mb-4">
          Caricamento dei libri in corso...
        </p>
      )}

      {error && (
        <p className="text-red-500 font-semibold mb-4">
          Errore: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="relative z-10 grid grid-cols-1 gap-8 mt-10 px-4">
          {filteredBooks.map((book) => (
            <BookItemPrestato 
              key={book.id} 
              book={book} 
              isAdmin 
              loanId={book.loanId} // Passiamo l'ID del prestito
            />
          ))}
        </div>
      )}
    </>
  );
}