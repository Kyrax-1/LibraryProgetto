const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Per l'hashing delle password
const jwt = require("jsonwebtoken"); // Per la creazione e verifica dei token JWT
const db = require("../../db"); // La tua connessione al database

//JWT_SECRET sia definito nel tuo .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

// Middleware per la gestione degli errori asincroni (utile per Express)
// Questo è un helper per evitare di avvolgere ogni async/await in try/catch.

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 1. Rotta di Registrazione Utente
// POST /api/auth/register
router.post("/register", asyncHandler(async (req, res) => {
  const { nome, cognome, email, password } = req.body;

  // Validazione di base dell'input
  if (!nome || !cognome || !email || !password) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori." });
  }

  // Validazione formato email (semplice)
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Formato email non valido." });
  }

  // Validazione lunghezza password (esempio)
  if (password.length < 6) {
    return res.status(400).json({ message: "La password deve contenere almeno 6 caratteri." });
  }

  try {
    // Controllo se l'email esiste già
    const [existingUsers] = await db.query(
      "SELECT UtenteID FROM utente WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email già registrata." }); // 409 Conflict
    }

    // Hash della password
    // Il secondo argomento è il "salt rounds", un valore più alto è più sicuro ma più lento.
    // 10 è un buon compromesso per la maggior parte delle applicazioni.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserimento del nuovo utente nel database
    const [result] = await db.query(
      "INSERT INTO utente (nome, cognome, email, password_hash) VALUES (?, ?, ?, ?)",
      [nome, cognome, email, hashedPassword]
    );

    // Recupera l'ID dell'utente appena creato
    const newUserId = result.insertId;

    // Puoi decidere se loggare automaticamente l'utente dopo la registrazione o semplicemente inviare una conferma di successo.
    // Per semplicità, qui inviamo solo un messaggio di successo.
    res.status(201).json({ 
      message: "Registrazione avvenuta con successo!",
      userId: newUserId,
      email: email
    });

  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    // Errore generico del server
    res.status(500).json({ message: "Errore durante la registrazione. Riprova più tardi." });
  }
}));

// 2. Rotta di Login Utente
// POST /api/auth/login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validazione di base dell'input
  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatori." });
  }

  try {
    // 1. Cerca l'utente nel database tramite email
    const [users] = await db.query(
      "SELECT UtenteID, nome, cognome, email, password_hash, role FROM utente WHERE email = ?",
      [email]
    );

    // Se l'utente non esiste
    if (users.length === 0) {
      // È buona pratica non indicare se l'email non esiste o la password è sbagliata per prevenire l'enumerazione degli account.
      return res.status(401).json({ message: "Credenziali non valide." });
    }

    const user = users[0];

    // 2. Confronta la password fornita con l'hash salvato
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // Se le password non corrispondono
    if (!isMatch) {
      return res.status(401).json({ message: "Credenziali non valide." });
    }

    // 3. Le credenziali sono valide: Genera un token JWT
    // Payload del token: le informazioni che vuoi includere nel token(non includere dati sensibili come password_hash)
    const tokenPayload = { 
      id: user.UtenteID, 
      email: user.email, 
      nome: user.nome, 
      cognome: user.cognome ,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // 4. Restituisci il token (e magari alcuni dati utente)
    res.json({
      message: "Login effettuato con successo!",
      token: token,
      user: {
        id: user.UtenteID,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({ message: "Errore durante il login. Riprova più tardi." });
  }
}));

// Esporta il router per essere usato in server.js
module.exports = router;