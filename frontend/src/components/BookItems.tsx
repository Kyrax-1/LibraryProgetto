import { useAppDispatch } from "../redux/hooks";
import { deleteBookAsync } from "../redux/books/booksThunks";
import type { Book } from "../redux/books/booksSlice";
import DialogModifica from "./DialogModifica";

type BookItemProps = {
    book: Book;
    isAdmin: boolean;
};

export default function BookItem({ book, isAdmin }: BookItemProps) {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        if (window.confirm(`Sei sicuro di voler eliminare "${book.title}"?`)) {
            dispatch(deleteBookAsync(book.id));
            console.log(book.id, book)
        }
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

                    <DialogModifica Book={book}></DialogModifica>
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