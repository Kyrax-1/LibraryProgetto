import { useAppDispatch } from "../redux/hooks";
import type { Book } from "../redux/booksSlice";
import { returnBookAsync } from "../redux/loansThunks";

type BookItemProps = {
    book: Book;
    isAdmin: boolean;
};

export default function BookItem({ book, isAdmin }: BookItemProps) {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        if (window.confirm(`Sei sicuro di voler terminare il prestito di "${book.title}"?`)) {
            dispatch(returnBookAsync(
                book.id
            ));
        }
    };

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

            {isAdmin && (
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                        Termina Prestito
                    </button>
                </div>
            )}
        </div>
    );
}
