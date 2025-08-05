const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // Importa il segreto JWT dal .env

// Middleware per la verifica del token JWT
const verifyToken = (req, res, next) => {
  // 1. Controlla se l'header 'Authorization' è presente
  // I token JWT vengono tipicamente inviati nell'header 'Authorization'
  // nel formato 'Bearer YOUR_TOKEN_HERE'
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    // Se l'header non è presente, l'utente non è autenticato
    return res.status(401).json({ message: "Accesso negato: token non fornito." });
  }

  // Estrai il token dalla stringa "Bearer YOUR_TOKEN_HERE"
  const token = authHeader.split(" ")[1]; // Prende la seconda parte dopo "Bearer "

  if (!token) {
    // Se il token non è stato estratto correttamente
    return res.status(401).json({ message: "Accesso negato: formato token non valido." });
  }

  try {
    // 2. Verifica il token
    // jwt.verify() decodifica il token usando il JWT_SECRET
    // Se il token è valido e non scaduto, restituisce il payload (id utente, email, ecc.)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Aggiungi i dati dell'utente decodificati all'oggetto `req`
    // Questo ti permette di accedere ai dati dell'utente (es. req.user.id) nelle rotte successive
    req.user = decoded; // Salva il payload decodificato in req.user

    // 4. Passa al prossimo middleware o alla funzione della rotta
    next();

  } catch (error) {
    // Se la verifica del token fallisce (es. token scaduto, token non valido, segreto sbagliato)
    console.error("Errore verifica token:", error.message);
    return res.status(403).json({ message: "Accesso negato: token non valido o scaduto." }); // 403 Forbidden
  }
};

module.exports = verifyToken; // Esporta la funzione middleware