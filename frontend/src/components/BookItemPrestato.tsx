import { useAppDispatch } from "../redux/hooks";
import type { Book } from "../redux/books/booksSlice";
import { extendLoanAsync, returnBookAsync } from "../redux/loans/loansThunks";

type BookItemPrestatoProps = {    // Type props per item in prestito
  book: Book;
  loanId?: number;
  showBorrowerInfo?: boolean;
  isAdminView?: boolean;
};

export default function BookItemPrestato({ 
  book, 
  loanId, 
  showBorrowerInfo = false,
  isAdminView = false 
}: BookItemPrestatoProps) {
  const dispatch = useAppDispatch();

  function parseItalianDate(dateString: string) {   // funzione necessaria per la visualizzazione della data dd-mm-yyyy
    const [day, month, year] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const handleReturnBook = () => {  // gestione restituisci prestito
    if (!loanId) {  // controllo se loanid è esistente
      console.error("Impossibile terminare il prestito: loanId mancante");
      return;
    }

    if (window.confirm(`Sei sicuro di voler terminare il prestito di "${book.title}"?`)) {  //alert di conferma per termina prestito
      dispatch(returnBookAsync({ loanId }));  // chiamata API per terminare prestito
    }
  };

  const handleExtendLoan = () => {  // gestione estensione prestito
    if (!loanId) {  // controllo esistenza del prestito per loanId
      console.error("Impossibile estendere il prestito: loanId mancante");
      return;
    }
    
    if (window.confirm(`Vuoi estendere il prestito di "${book.title}" di un mese?`)) { // alert di conferma per estensione prestito
      dispatch(extendLoanAsync({ loanId })); // chiamata API per estensione prestito
    }
  };

  // Calcola se il prestito è scaduto
  const isExpired = book.loanExpir ? parseItalianDate(book.loanExpir) < new Date() : false;
  
  // Calcola i giorni rimanenti
  const getDaysRemaining = () => {
    if (!book.loanExpir) return null;
    const expireDate = parseItalianDate(book.loanExpir);
    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-l-4 ${
      isExpired ? 'border-red-500' : daysRemaining && daysRemaining <= 7 ? 'border-yellow-500' : 'border-indigo-500'
    }`}>
      
      {/* Header con titolo e badge stato */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-indigo-700 mb-1">{book.title}</h3>
          <p className="text-gray-600 font-medium">di {book.author}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {isExpired && (
            <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
              Scaduto
            </span>
          )}
          {!isExpired && daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
            <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
              Scade tra {daysRemaining} giorni
            </span>
          )}
          {!isExpired && daysRemaining !== null && daysRemaining > 7 && (
            <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
              {daysRemaining} giorni rimanenti
            </span>
          )}
        </div>
      </div>

      {/* Informazioni del prestito */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {book.loanDate && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Inizio Prestito</p>
              <p className="text-sm font-medium text-gray-800">{book.loanDate}</p>
            </div>
          )}

          {book.loanExpir && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Scadenza</p>
              <p className={`text-sm font-medium ${
                isExpired ? 'text-red-600' : daysRemaining && daysRemaining <= 7 ? 'text-yellow-600' : 'text-gray-800'
              }`}>
                {book.loanExpir}
              </p>
            </div>
          )}

          {showBorrowerInfo && book.borrowerName && (
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Prestato a</p>
              <p className="text-sm font-medium text-indigo-600">{book.borrowerName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pulsanti di azione */}
      {loanId && (
        <div className="flex flex-wrap justify-end gap-2">
          {isAdminView ? (
            // Vista Admin: solo termina prestito
            <button
              onClick={handleReturnBook}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <span>🔚</span>
              Termina Prestito
            </button>
          ) : (
            // Vista Utente: estendi e restituisci
            <>
              <button
                onClick={handleExtendLoan}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center gap-2"
                disabled={isExpired}
              >
                <span>📅</span>
                Estendi (+30 giorni)
              </button>
              <button
                onClick={handleReturnBook}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <span>✅</span>
                Restituisci
              </button>
            </>
          )}
        </div>
      )}

      {/* Messaggio se loanId mancante */}
      {!loanId && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm text-yellow-800 font-medium">
              ID prestito mancante - Azioni non disponibili
            </p>
          </div>
        </div>
      )}
    </div>
  );
}