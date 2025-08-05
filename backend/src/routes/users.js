const express = require("express");
const router = express.Router();
const db = require("../../db"); // Percorso relativo corretto
const verifyToken = require("../middleware/authMiddleware"); // Importa il middleware di autenticazione

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Rotta per il recupero degli utenti
// QUESTA ROTTA È ORA PROTETTA DAL MIDDLEWARE verifyToken
router.get("/", verifyToken, asyncHandler(async (req, res) => { // Era /api/utenti, ora /api/users
  try {
    console.log("Tentativo di recupero utenti...");

    const [rows] = await db.query(`
      SELECT UtenteID as id, Nome as nome, Cognome as cognome, Email as email, Role as role FROM utente
    `); // Ho selezionato solo i campi rilevanti per evitare di esporre dati sensibili in futuro

    console.log("Utenti recuperati:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Errore GET utenti - Dettagli completi:", error);
    console.error("Errore message:", error.message);
    console.error("Errore code:", error.code);
    res.status(500).json({ error: "Errore nel recupero utenti" });
  }
}));

module.exports = router;