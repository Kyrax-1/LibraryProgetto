import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks, updateBookAsync } from '../redux/books/booksThunks';
import { Alert, CircularProgress } from '@mui/material';

export default function DialogModifica({ bookId }: { bookId: number }) {
    const dispatch = useAppDispatch();

    // Recupera il libro dallo store aggiornato
    const book = useAppSelector((state) =>
        state.books.items.find((b) => b.id === bookId)
    );

    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [author, setAuthor] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

   const handleClickOpen = () => {
        if (book) {
            setTitle(book.title);
            setAuthor(book.author);
        }
        setError(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await dispatch(
                updateBookAsync({
                    id: bookId,
                    updates: { title, author },
                })
            ).unwrap();

            dispatch(fetchBooks());
            
            handleClose();
        } catch (err) {
            setError('Errore durante la modifica del libro');
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleClickOpen} 
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
                Modifica
            </button>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Modifica Libro</DialogTitle>
                <DialogContent>
                    {/* Mostra l'errore se presente */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Titolo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full my-2 p-2 border rounded"
                            required
                            disabled={loading}
                        />
                        <input
                            type="text"
                            placeholder="Autore"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="block w-full my-2 p-2 border rounded"
                            required
                            disabled={loading}
                        />

                        <DialogActions>
                            <button 
                                type="button" 
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Annulla
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        Salvataggio...
                                    </>
                                ) : (
                                    "Salva Modifiche"
                                )}
                            </button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}