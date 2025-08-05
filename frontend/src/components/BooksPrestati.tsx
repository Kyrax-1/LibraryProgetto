import { useEffect, useMemo } from "react";
import { fetchBooks } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItemPrestato from "./BookItemPrestato";
import { useParams } from "react-router";
import { fetchUtenti } from '../redux/utenti/utentiThunk';

export default function BooksPrestati() {
  const dispatch = useAppDispatch();

  // Selettori Redux per i libri
  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);
  const error = useAppSelector((state) => state.books.error);
  
  // Selettori Redux per gli utenti
  const utenti = useAppSelector((state) => state.utenti.utenti);
  const utentiLoading = useAppSelector((state) => state.utenti.utentiLoading);
  const utentiError = useAppSelector((state) => state.utenti.error);

  const { utenteId } = useParams();
  const isAdminView = !utenteId;


  // Memoizza la ricerca dell'utente
  const utenteTrovato = useMemo(() => {
    if (isAdminView || !utenteId || utenti.length === 0) return null;
    
    return utenti.find((u) => String(u.id) === String(utenteId)) || null;
  }, [utenti, utenteId, isAdminView]);

  // Memoizza il filtraggio dei libri
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Mostra solo libri non disponibili (prestati)
      if (book.isAvailable) return false;

      // Se è vista admin, mostra tutti i libri prestati
      if (isAdminView) return true;

      // Se è vista utente specifico, filtra per borrowerName
      return book.borrowerName === utenteTrovato?.nomeCompleto;
    });
  }, [books, isAdminView, utenteTrovato]);

  // Calcola statistiche sui prestiti
  const stats = useMemo(() => {
    const today = new Date();
    
    const expired = filteredBooks.filter(book => {
      if (!book.loanExpir) return false;
      const [day, month, year] = book.loanExpir.split('-');
      const expireDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return expireDate < today;
    }).length;

    const expiringSoon = filteredBooks.filter(book => {
      if (!book.loanExpir) return false;
      const [day, month, year] = book.loanExpir.split('-');
      const expireDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const diffTime = expireDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    }).length;

    return { expired, expiringSoon, total: filteredBooks.length };
  }, [filteredBooks]);

  // Effect per il fetch dei dati
  useEffect(() => {
    dispatch(fetchBooks());
    if (!isAdminView) {
      dispatch(fetchUtenti());
    }
  }, [dispatch, isAdminView]);

  // Loading state per utenti
  if (!isAdminView && utentiLoading && utenti.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium text-lg">Caricamento utenti...</p>
        </div>
      </div>
    );
  }

  // Error state per utenti
  if (!isAdminView && utentiError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Errore nel caricamento utenti</h3>
        <p className="text-red-600 mb-4">Errore: {utentiError}</p>
        <button 
          onClick={() => dispatch(fetchUtenti())}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  // Utente non trovato
  if (!isAdminView && !utentiLoading && utenti.length > 0 && utenteId && !utenteTrovato) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 text-4xl mb-4">🚫</div>
        <h3 className="text-yellow-800 font-semibold text-lg mb-2">Utente non trovato</h3>
        <p className="text-yellow-600 mb-4">
          Impossibile trovare l'utente con ID: <code className="bg-yellow-100 px-2 py-1 rounded">{utenteId}</code>
        </p>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-4">
          <p><strong>Info disponibili:</strong></p>
          <p>Utenti caricati: {utenti.length}</p>
          <p>IDs disponibili: {utenti.map(u => u.id).join(', ')}</p>
        </div>
      </div>
    );
  }

  // Utenti non caricati
  if (!isAdminView && !utentiLoading && utenti.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-blue-600 text-4xl mb-4">📊</div>
        <h3 className="text-blue-800 font-semibold text-lg mb-2">Nessun utente caricato</h3>
        <p className="text-blue-600 mb-4">
          I dati degli utenti non sono stati caricati correttamente.
        </p>
        <button 
          onClick={() => dispatch(fetchUtenti())}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Ricarica utenti
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading State - Books */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="ml-3 text-indigo-600 font-medium">Caricamento prestiti in corso...</p>
        </div>
      )}

      {/* Error State - Books */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">❌ Errore libri: {error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Header con statistiche */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">
                  {isAdminView ? "Gestione Prestiti" : `Prestiti di ${utenteTrovato?.nomeCompleto}`}
                </h2>
                <p className="text-indigo-600">
                  {stats.total} {stats.total === 1 ? 'libro' : 'libri'} attualmente in prestito
                </p>
              </div>

              {/* Badge statistiche */}
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {stats.expired > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    {stats.expired} scaduti
                  </span>
                )}
                {stats.expiringSoon > 0 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {stats.expiringSoon} in scadenza
                  </span>
                )}
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {stats.total} totali
                </span>
              </div>
            </div>
          </div>

          {/* Lista prestiti */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessun prestito attivo</h3>
              <p className="text-gray-500">
                {isAdminView
                  ? "Non ci sono libri attualmente prestati."
                  : `${utenteTrovato?.nomeCompleto} non ha libri in prestito.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBooks.map((book) => (
                <BookItemPrestato
                  key={book.id}
                  book={{
                    ...book,
                    // Converte la data di scadenza in formato italiano
                    loanExpir: book.loanExpir
                  }}
                  loanId={book.loanId}
                  showBorrowerInfo={isAdminView}
                  isAdminView={isAdminView}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}