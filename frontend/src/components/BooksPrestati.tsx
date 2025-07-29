import { useEffect } from "react";
import type { Book } from "../redux/booksSlice";
import { fetchBooks } from "../redux/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItemPrestato from "./BookItemPrestato";


export default function BookPrestati(){
const dispatch = useAppDispatch();

    const books = useAppSelector((state) => state.book.items);
    const loading = useAppSelector((state) => state.book.loading);
    const error = useAppSelector((state) => state.book.error);

    const filteredArray: Book[] | any = [];

    books.forEach(book => {
        if(!book.isAvailable){
            filteredArray.push(book)
        }
    });
    
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
        {filteredArray.map((book: Book) => (
          <BookItemPrestato key={book.id} book={book} isAdmin />
        ))}
      </div>
    )}
  </>
);
}