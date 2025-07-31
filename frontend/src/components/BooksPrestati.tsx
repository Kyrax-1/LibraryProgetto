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
  const utentiLoading = useAppSelector((state) => state.utenti.loading);

  const { utenteId } = useParams();
  
  const isAdminView = !utenteId;

  const utenteTrovato = !isAdminView ? utenti.find((u) => u.id === parseInt(utenteId!)): null;

  const filteredBooks = books.filter((book) =>{
      // Mostra solo libri non disponibili (prestati)
    if (book.isAvailable) return false;
    // Se è vista admin, mostra tutti i libri prestati
    if (isAdminView) return true;
    // Se è vista utente specifico, filtra per borrowerName
    return book.borrowerName === utenteTrovato?.nomeCompleto;
  }
  );

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const isLoading = loading || utentiLoading;

  if (!isAdminView && !utentiLoading && utenti.length > 0 && !utenteTrovato) {
    return (
      <div className="text-red-500 font-semibold mb-4">
        Utente non trovato con ID: {utenteId}
      </div>
    );
  }

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
         <div className="mb-4">
            {isAdminView ? (
              <h2 className="text-xl font-semibold text-gray-800">
                Tutti i Prestiti Attivi ({filteredBooks.length})
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">
                Prestiti di {utenteTrovato?.nomeCompleto} ({filteredBooks.length})
              </h2>
            )}
          </div>

          {filteredBooks.length === 0 ? (
            <p className="text-gray-500">
              {isAdminView 
                ? "Nessun libro attualmente prestato." 
                : "Nessun libro prestato a questo utente."
              }
            </p>
          ) : (
            filteredBooks.map((book) => (
              <BookItemPrestato
                key={book.id}
                book={book}
                loanId={book.loanId}
                showBorrowerInfo={isAdminView} // Passa questa prop per mostrare info borrower in vista admin
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
