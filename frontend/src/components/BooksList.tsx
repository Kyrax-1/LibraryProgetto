import { useEffect } from "react";
import { fetchBooks } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BookItem from "./BookItems";

type BooksListProps = {
  searchQuery?: string; // Prop per la ricerca
};

export default function BooksList({ searchQuery = "" }: BooksListProps) {
  const dispatch = useAppDispatch();

  const books = useAppSelector((state) => state.books.items);
  const loading = useAppSelector((state) => state.books.loading);
  const error = useAppSelector((state) => state.books.error);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Filtra i libri in base alla query di ricerca
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true; // Se non c'è ricerca, mostra tutti i libri
    
    const query = searchQuery.toLowerCase();
    const titleMatch = book.title.toLowerCase().includes(query);
    const authorMatch = book.author.toLowerCase().includes(query);
    
    return titleMatch || authorMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-blue-500 animate-pulse text-lg">
          Caricamento libri in corso...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500 font-semibold text-center">
          <p className="text-lg mb-2">Errore nel caricamento</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <div className="text-gray-500">
            <p className="text-lg mb-2">Nessun risultato trovato</p>
            <p className="text-sm">
              Non sono stati trovati libri che corrispondono a "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-lg">Nessun libro disponibile</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBooks.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
      
      {/* Info sui risultati */}
      <div className="col-span-full text-center mt-4">
        <p className="text-sm text-gray-500">
          {searchQuery 
            ? `${filteredBooks.length} risultat${filteredBooks.length === 1 ? 'o' : 'i'} trovat${filteredBooks.length === 1 ? 'o' : 'i'}`
            : `${books.length} libr${books.length === 1 ? 'o' : 'i'} totali`
          }
        </p>
      </div>
    </div>
  );
}