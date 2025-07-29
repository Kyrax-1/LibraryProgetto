const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Permetti richieste dal frontend Vue
  })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

let books = [
  {
    id: 1,
    title: "Harry Potter e la Pietra Filosofale",
    author: "J.K. Rowling",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 2,
    title: "Il Trono di Spade",
    author: "George R.R. Martin",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 3,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 4,
    title: "Orgoglio e Pregiudizio",
    author: "Jane Austen",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 5,
    title: "Il Nome della Rosa",
    author: "Umberto Eco",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 6,
    title: "La Solitudine dei Numeri Primi",
    author: "Paolo Giordano",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  },
  {
    id: 7,
    title: "Io prima di te",
    author: "Jojo Moyes",
    isAvailable: true,
    borrowerName: "null",
    loanDate: "null",
    loanExpir: "null"
  }
];

// GET lista books
app.get("/api/book", (req, res) => {
  res.json(books);
});

// POST aggiungi book
app.post("/api/book", (req, res) => {
  const newBook = req.body;
  newBook.id = books.length ? Math.max(...books.map((t) => t.id)) + 1 : 1;
  books.push(newBook);
  res.json(newBook);
});

//Delete
app.delete("/api/book/:id", (req, res) => {
  const id = parseInt(req.params.id); // Ottieni l'id dai parametri URL
  const index = books.findIndex((book) => book.id === id); // Trova l'indice

  if (index !== -1) {
    const deletedBook = books.splice(index, 1); // Rimuove il libro
    res.json({ message: "Libro eliminato", book: deletedBook[0] });
  } else {
    res.status(404).json({ message: "Libro non trovato" });
  }
});

//Modificare 
app.patch("/api/book/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const partialUpdate = req.body;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = { ...books[index], ...partialUpdate };
    res.json(books[index]); 
  } else {
    res.status(404).json({ message: "Libro non trovato" });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
