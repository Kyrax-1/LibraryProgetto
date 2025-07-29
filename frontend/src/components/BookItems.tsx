import { useAppDispatch } from "../redux/hooks";
import { deleteBookAsync } from "../redux/booksThunks";
import type { Book } from "../redux/booksSlice";

type BookItemProps = {
    book: Book;
    isAdmin: boolean;
};

export default function BookItem({ book, isAdmin }: BookItemProps) {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        if (window.confirm(`Sei sicuro di voler eliminare "${book.title}"?`)) {
            dispatch(deleteBookAsync(book.id));
        }
    };

    const handleEdit = () => {
        // logica di modifica
        console.log("Modifica libro", book.id);
    };

    const availabilityColor = book.isAvailable ? 'text-green-500' : 'text-red-500';
    const availabilityText = book.isAvailable ? 'Disponibile' : 'Prestato';

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-200">
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
                    <button
                        onClick={handleEdit}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                        Modifica
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                        Elimina
                    </button>
                </div>
            )}
        </div>
    );
}