import { useEffect } from "react";
import type { Book } from "../redux/books/booksSlice";
import { fetchBooks } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItem from "./BookItems";

export default function BooksList() {
    const dispatch = useAppDispatch();
    
    const books = useAppSelector((state) => state.books.items);
    console.log("📚 Lista libri aggiornata:", books);
    const loading = useAppSelector((state) => state.books.loading);
    const error = useAppSelector((state) => state.books.error);

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
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 px-4">
        {books.map((book: Book) => (
          <BookItem key={book.id} book={book} isAdmin />
        ))}
      </div>
    )}
  </>
);
}
