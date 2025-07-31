import { useEffect } from "react";
import { fetchBooks } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItemPrestato from "./BookItemPrestato";
import { useParams } from "react-router";

export default function BookPrestati() {
  const dispatch = useAppDispatch();

  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);
  const error = useAppSelector((state) => state.books.error);
  const utenti = useAppSelector((state) => state.utenti.utenti);
  const { utenteId } = useParams();

  console.log(parseInt(utenteId!))

  const utenteTrovato = utenti.find((u) => u.id === parseInt(utenteId!));
  console.log("utente trovato : " + utenteTrovato)

  const filteredBooks = books.filter(
    (book) =>
      !book.isAvailable &&
      book.borrowerName === utenteTrovato?.nomeCompleto // usa il campo corretto che contiene il nome
  );

  console.log(filteredBooks)

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
        <p className="text-red-500 font-semibold mb-4">Errore: {error}</p>
      )}

      {!loading && !error && (
        <div className="relative z-10 grid grid-cols-1 gap-8 mt-10 px-4">
          {filteredBooks.length === 0 ? (
            <p className="text-gray-500">Nessun libro prestato a questo utente.</p>
          ) : (
            filteredBooks.map((book) => (
              <BookItemPrestato
                key={book.id}
                book={book}
                loanId={book.loanId}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
