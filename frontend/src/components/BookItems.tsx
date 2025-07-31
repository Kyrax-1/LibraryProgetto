import { useLocation, useParams } from "react-router";
import type { Book } from "../redux/books/booksSlice";
import { deleteBookAsync } from "../redux/books/booksThunks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import DialogModifica from "./DialogModifica";
import { borrowBookAsync } from "../redux/loans/loansThunks";
import { useEffect } from "react";
import { fetchUtenti } from "../redux/utenti/utentiThunk";


type BookItemProps = {
    book: Book;
};

export default function BookItem({ book: initialBook }: BookItemProps) {
    const location = useLocation();
    const { id } = useParams(); // destruttura direttamente qui
    const isAdmin = location.pathname.includes('admin');
    const dispatch = useAppDispatch();

    const utenti = useAppSelector((state) => state.utenti.utenti);

    useEffect(() => {
        dispatch(fetchUtenti());
    }, [dispatch]);



    const utente = utenti.find(utente => utente.id === parseInt(id!));



    const book = useAppSelector((state) =>
        state.books.items.find((b) => b.id === initialBook.id)
    );

    if (!book) return null; // Evita errori se viene eliminato

    const handleDelete = () => {
        if (window.confirm(`Sei sicuro di voler eliminare "${book.title}"?`)) {
            dispatch(deleteBookAsync(book.id));
        }
    };

    const availabilityColor = book.isAvailable ? 'text-green-500' : 'text-red-500';
    const availabilityText = book.isAvailable ? 'Disponibile' : 'Prestato';

    function handleLoan() {

        if (!book || !utente || !id) return null;

        dispatch(borrowBookAsync({
            bookId: book.id,
            borrowerName: utente.nomeCompleto,
            userId: parseInt(id)
        }))
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-indigo-700 mb-1">{book.title}</h3>
            <p className="text-gray-700">Autore: {book.author}</p>

            <p className={`mt-2 font-semibold ${availabilityColor}`}>
                Disponibilità: {availabilityText}
            </p>

            {!book.isAvailable && book.loanExpir && (
                <p className="text-sm text-gray-500">Scadenza prestito: {book.loanExpir}</p>
            )}


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

            {!isAdmin && book.isAvailable && (
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleLoan}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                        Inizia Prestito
                    </button>
                </div>
            )}
        </div>
    );
}
