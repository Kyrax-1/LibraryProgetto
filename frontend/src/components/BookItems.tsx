import { useLocation } from "react-router";
import type { Book } from "../redux/books/booksSlice";
import { deleteBookAsync, fetchBookLoan } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import DialogModifica from "./DialogModifica";
import { borrowBookAsync } from "../redux/loans/loansThunks";
import { useEffect } from "react";

type BookItemProps = {
  book: Book;
};

export default function BookItem({ book: initialBook }: BookItemProps) {
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");
  const dispatch = useAppDispatch();

  const book = useAppSelector((state) =>
    state.books.items.find((b) => b.id === initialBook.id)
  );

  const currentUser = useAppSelector((state) => state.utenti.user);

  if (!book) return null;

  useEffect(() => {
    if (!book.isAvailable && !book.loanId) {
      dispatch(fetchBookLoan(book.id));
    }
  }, [dispatch, book.id, book.isAvailable, book.loanId]);

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare "${book.title}"?`)) {
      dispatch(deleteBookAsync(book.id));
    }
  };

  const handleLoan = () => {
    // Aggiungi un controllo per l'utente e per l'ID
    if (!currentUser || typeof currentUser.id !== 'number') {
      alert("Devi essere loggato con un utente valido per effettuare un prestito.");
      return;
    }

    // Aggiungi un controllo per il libro e per l'ID
    if (!book || typeof book.id !== 'number') {
      alert("Errore: Impossibile trovare il libro da prestare.");
      return;
    }

    const nomeCompleto = `${currentUser.nome} ${currentUser.cognome}`;

    // Aggiungi un console.log per verificare i valori prima di inviarli
    console.log("Dati del prestito da inviare:", {
      bookId: book.id,
      userId: currentUser.id,
      borrowerName: nomeCompleto
    });

    if (window.confirm(`Confermi il prestito di "${book.title}" a ${nomeCompleto}?`)) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);

      const loanDate = today.toISOString().slice(0, 10);
      const loanExpir = futureDate.toISOString().slice(0, 10);

      dispatch(
        borrowBookAsync({
          bookId: book.id,
          borrowerName: nomeCompleto,
          userId: currentUser.id,
          loanDate: loanDate,
          loanExpir: loanExpir,
        })
      );
    }
  };

  const availabilityText = book.isAvailable ? "Disponibile" : "Non disponibile";
  const availabilityColor = book.isAvailable ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 relative">
      <h3 className="text-lg font-bold text-indigo-700 mb-1">{book.title}</h3>
      <p className="text-gray-700">Autore: {book.author}</p>

      <p className={`mt-2 font-semibold ${availabilityColor}`}>
        Disponibilità: {availabilityText}
      </p>

      {!book.isAvailable && book.borrowerName && isAdmin && (
        <p className="text-sm text-gray-500">Prestato a: {book.borrowerName}</p>
      )}

      {!book.isAvailable && book.loanExpir && (
        <p className="text-sm text-gray-500">Scadenza prestito: {book.loanExpir}</p>
      )}

      {/* Pulsanti Admin */}
      {isAdmin && (
        <div className="flex justify-end gap-2 mt-4">
          <DialogModifica bookId={book.id} />
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Elimina
          </button>
        </div>
      )}

      {/* Pulsante prestito solo per libri disponibili per gli utenti non admin */}
      {!isAdmin && book.isAvailable ? (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleLoan}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
          >
            Richiedi prestito
          </button>
        </div>
      ) : null}
    </div>
  );
}