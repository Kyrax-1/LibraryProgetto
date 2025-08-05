// 1. Importazioni iniziali e setup base di Express
const express = require("express");
const cors = require("cors");
const db = require("./db");
const booksRoutes = require("./src/routes/books");
const authRoutes = require("./src/routes/auth");
const loansRoutes = require("./src/routes/loans");
const userRoutes = require("./src/routes/users");
const app = express();
const port = process.env.PORT || 8080; // Usa la porta dal .env o la 8080

// Middleware globali
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Usa la variabile d'ambiente per l'origine CORS
  })
);
app.use(express.json());

// 2. Montaggio delle rotte: Qui useremo le rotte separate
// Tutte le rotte di autenticazione inizieranno con /api/auth
app.use("/api/auth", authRoutes);
// Tutte le rotte relative ai libri inizieranno con /api/book
app.use("/api/book", booksRoutes);
// Tutte le rotte relative agli utenti inizieranno con /api/users
app.use("/api/users", userRoutes); // Ho cambiato da /api/utenti a /api/users per coerenza
// Tutte le rotte relative ai prestiti inizieranno con /api/loans
app.use("/api/loans", loansRoutes); // Le nuove rotte specifiche per i prestiti

// Middleware di gestione degli errori globale (questo è importante per asyncHandler)
app.use((err, req, res, next) => {
  console.error("Errore globale non gestito:", err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Errore interno del server",
    details: err.stack // Non mostrare stack trace in produzione
  });
});


// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

