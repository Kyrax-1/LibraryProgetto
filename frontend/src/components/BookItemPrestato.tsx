import { useAppDispatch} from "../redux/hooks";
import type { Book } from "../redux/books/booksSlice";
import { extendLoanAsync, returnBookAsync } from "../redux/loans/loansThunks";


type BookItemPrestatoProps = {
  book: Book;
  loanId?: number;
  showBorrowerInfo?: boolean;
};

export default function BookItemPrestato({ book, loanId, showBorrowerInfo}: BookItemPrestatoProps) {
  const dispatch = useAppDispatch();
  const isAdminView = showBorrowerInfo;
  
  const handleReturnBook = () => {
    if (!loanId) {
      console.error("Impossibile terminare il prestito: loanId mancante");
      return;
    }
    
    if (window.confirm(`Sei sicuro di voler terminare il prestito di "${book.title}"?`)) {
      dispatch(returnBookAsync({ loanId })); 
    }
  };

  function handleExtendLoan(): void {
    if (!loanId){
      console.error("Impossibile estendere il prestito: loanId mancante");
      return;
    }
    if (window.confirm(`Vuoi allungare il prestito di "${book.title}" ?`)) {
      dispatch(extendLoanAsync({loanId}))
    }
  }

  const isExpired = book.loanExpir && new Date(book.loanExpir) < new Date();

   return (
    <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-200">
      {/* Header con titolo e stato */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-indigo-700 mb-1">{book.title}</h3>
          <p className="text-gray-700">Autore: {book.author}</p>
        </div>
        {isExpired && (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            Scaduto
          </span>
        )}
      </div>

      {/* Informazioni del prestito */}
      <div className="space-y-1 mb-4">
        {book.loanDate && (
          <p className="text-sm text-gray-500">
            Inizio prestito: {book.loanDate}
          </p>
        )}

        {book.loanExpir && (
          <p className={`text-sm ${isExpired ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            Scadenza prestito: {book.loanExpir}
          </p>
        )}

        {/* Mostra info borrower solo se richiesto (utile per vista admin) */}
        {showBorrowerInfo && book.borrowerName && (
          <p className="text-sm text-indigo-600 font-medium">
            Prestato a: {book.borrowerName}
          </p>
        )}
      </div>

      {/* Pulsanti di azione */}
      {loanId && (
        <div className="flex justify-end gap-2 mt-4">
          {isAdminView ? (
            // Vista Admin: solo termina prestito
            <button
              onClick={handleReturnBook}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
            >
              Termina Prestito
            </button>
          ) : (
            // Vista Utente: estendi prestito
            <button
              onClick={handleExtendLoan}
              className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200 font-medium"
            >
              Estendi Prestito
            </button>
          )}
        </div>
      )}

      {/* Messaggio se loanId mancante */}
      {!loanId && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ ID prestito mancante - Azioni non disponibili
        </div>
      )}
    </div>
  );
}