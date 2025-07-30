import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch } from '../redux/hooks';
import { updateBookAsync } from '../redux/books/booksThunks';
import type{ Book } from '../redux/books/booksSlice';
import { Alert, CircularProgress } from '@mui/material';

export default function DialogModifica({ Book }: { Book: Book }) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(Book.title);
    const [author, setAuthor] = React.useState(Book.author);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await dispatch(
                updateBookAsync({
                    id: Book.id,
                    updates: { title, author },
                })
            ).unwrap();
            handleClose();
        } catch (err) {
            setError('Errore durante la modifica del libro');
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpen = () => {
        setTitle(Book.title);
        setAuthor(Book.author);
        setError(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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