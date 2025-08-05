const express = require("express");
const router = express.Router();
const db = require("../../db");
const verifyToken = require("../middleware/authMiddleware");

// Middleware per la gestione degli errori asincroni
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET tutti i prestiti attivi (per Admin)
router.get("/", verifyToken, asyncHandler(async (req, res) => {
  try {
    console.log("Tentativo di recupero tutti i prestiti...");
    const [rows] = await db.query(`
      SELECT
        p.PrestitoID as loanId,
        p.LibroID as bookId,
        l.title as bookTitle,
        l.author as bookAuthor,
        p.UtenteID as userId,
        u.Nome as userName,
        u.Cognome as userSurname,
        p.borrowerName,
        DATE_FORMAT(p.loanDate, '%d-%m-%Y') as loanDate,
        DATE_FORMAT(p.loanExpir, '%d-%m-%Y') as loanExpir
      FROM prestito p
      JOIN libro l ON p.LibroID = l.LibroID
      JOIN utente u ON p.UtenteID = u.UtenteID
      WHERE p.loanExpir > NOW() OR p.loanExpir IS NULL
      ORDER BY p.loanExpir ASC
    `); // Ordina per scadenza per visualizzare prima quelli in scadenza

    console.log("Prestiti recuperati:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Errore GET tutti i prestiti:", error);
    res.status(500).json({ error: "Errore nel recupero di tutti i prestiti" });
  }
}));

// GET prestiti per un utente specifico
router.get("/user/:userId", verifyToken, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID utente non valido" });
  }

  try {
    console.log(`Tentativo di recupero prestiti per UtenteID: ${userId}...`);
    const [rows] = await db.query(`
      SELECT
        p.PrestitoID as loanId,
        p.LibroID as bookId,
        l.title as bookTitle,
        l.author as bookAuthor,
        p.UtenteID as userId,
        u.Nome as userName,
        u.Cognome as userSurname,
        p.borrowerName,
        DATE_FORMAT(p.loanDate, '%d-%m-%Y') as loanDate,
        DATE_FORMAT(p.loanExpir, '%d-%m-%Y') as loanExpir
      FROM prestito p
      JOIN libro l ON p.LibroID = l.LibroID
      JOIN utente u ON p.UtenteID = u.UtenteID
      WHERE p.UtenteID = ? AND (p.loanExpir > NOW() OR p.loanExpir IS NULL)
      ORDER BY p.loanExpir ASC
    `, [userId]);

    console.log(`Prestiti recuperati per UtenteID ${userId}:`, rows);
    res.json(rows);
  } catch (error) {
    console.error(`Errore GET prestiti per UtenteID ${userId}:`, error);
    res.status(500).json({ error: `Errore nel recupero prestiti per utente ${userId}` });
  }
}));

module.exports = router;