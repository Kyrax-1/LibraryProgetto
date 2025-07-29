import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { Book } from '../redux/booksSlice';
import { useAppDispatch } from '../redux/hooks';
import { updateBookAsync } from '../redux/booksThunks';





export default function DialogModifica({ Book }: { Book: Book }) {

    const dispatch = useAppDispatch();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        

        dispatch(
            updateBookAsync({
                id: Book.id,
                updates: {
                    title: title,
                    author: author,
                },
            })
        );

        
        handleClose();
    };


    const [title, setTitle] = React.useState(Book.title);
    const [author, setAuthor] = React.useState(Book.author);

    return (
        <React.Fragment>
            <button onClick={handleClickOpen} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                Modifica
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Modifica Libro</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>


                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Titolo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full my-2 p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Autore"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="block w-full my-2 p-2 border rounded"
                        />

                        <DialogActions>
                            <button onClick={handleClose}>Esci</button>
                            <button type="submit">Salva</button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );

}


