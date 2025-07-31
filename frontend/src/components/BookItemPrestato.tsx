import { useAppDispatch} from "../redux/hooks";
import type { Book } from "../redux/books/booksSlice";
import { extendLoanAsync, returnBookAsync } from "../redux/loans/loansThunks";
import { useLocation } from "react-router";


type BookItemPrestatoProps = {
  book: Book;
  loanId?: number; // Rendilo opzionale con ?
};

export default function BookItemPrestato({ book, loanId }: BookItemPrestatoProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');


  const handleDelete = () => {
    if (!loanId) return; // Aggiunto controllo
    
    if (window.confirm(`Sei sicuro di voler terminare il prestito di "${book.title}"?`)) {
      dispatch(returnBookAsync({ loanId })); 
    }
  };

  function handleExtendLoan(): void {
    if (!loanId) return;
    if (window.confirm(`Vuoi allungare il prestito di "${book.title}" ?`)) {
      dispatch(extendLoanAsync({loanId}))
    }
    
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-200">
      <h3 className="text-lg font-bold text-indigo-700 mb-1">{book.title}</h3>
      <p className="text-gray-700">Autore: {book.author}</p>

            {book.loanDate && (
                <p className="text-sm text-gray-500 mt-2">Inizio prestito: {book.loanDate}</p>
            )}

            {book.loanExpir && (
                <p className="text-sm text-gray-500">Scadenza prestito: {book.loanExpir}</p>
            )}

            {book.borrowerName && (
                <p className="text-sm text-gray-500">Preso in prestito da: {book.borrowerName}</p>
            )}
      {isAdmin && ( // Mostra il bottone solo se c'è loanId
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Termina Prestito
          </button>
        </div>
      )}

      {!isAdmin && ( // Mostra il bottone solo se c'è loanId
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleExtendLoan}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Estendi Prestito
          </button>
        </div>
      )}
    </div>
  );
}