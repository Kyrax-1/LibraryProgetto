const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 8080;

app.use(
    cors({
        origin: "http://localhost:5173", // Permetti richieste dal frontend Vue
    })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

// GET
app.get("/api/book", async (req, res) => {
    try {
        console.log("Tentativo di recupero books...");

        // JOIN LEFT per includere tutti i libri, anche quelli non in prestito
        const [rows] = await db.query(`
      SELECT 
        l.LibroID as id,
        l.title,
        l.author,
        l.isAvailable,
        p.borrowerName,
        CASE 
          WHEN p.loanDate IS NOT NULL THEN DATE_FORMAT(p.loanDate, '%d-%m-%Y')
          ELSE NULL 
        END as loanDate,
        CASE 
          WHEN p.loanExpir IS NOT NULL THEN DATE_FORMAT(p.loanExpir, '%d-%m-%Y')
          ELSE NULL 
        END as loanExpir
      FROM libro l
      LEFT JOIN prestito p ON l.LibroID = p.LibroID
    `);

        console.log("libri recuperati:", rows);
        res.json(rows);
    } catch (error) {
        console.error("Errore GET libri - Dettagli completi:", error);
        console.error("Errore message:", error.message);
        console.error("Errore code:", error.code);
        res.status(500).json({ error: "Errore nel recupero libri" });
    }
});

// POST aggiungi book
app.post("/api/book", async (req, res) => {
    const { title, author, isAvailable } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO libro (title, author, isAvailable) VALUES (?, ?, ?)",
            [title, author, isAvailable]
        );
        const newBook = {
            LibroID: result.insertId,
            title,
            author,
            isAvailable
        };
        res.json(newBook);
    } catch (error) {
        console.error("Errore POST book", error);
        res.status(500).json({ error: "Errore creazione libro" });
    }
});

// DELETE rimuovi book
app.delete("/api/book/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await db.query(
      "DELETE FROM libro WHERE LibroID = ?",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Libro non trovato" });
    }
    
    res.json({ 
      message: "Libro eliminato", 
      LibroID: id,
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error("Errore DELETE book", error);
    res.status(500).json({ error: "Errore eliminazione libro" });
  }
});

// MODIFICA libro
// 1. Avvia prestito
app.post("/api/loan", async (req, res) => {
  const { LibroID, UtenteID, borrowerName, loanDate, loanExpir } = req.body;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Inserisci prestito
    const [loanResult] = await connection.query(
      "INSERT INTO prestito (LibroID, UtenteID, borrowerName, loanDate, loanExpir) VALUES (?, ?, ?, ?, ?)",
      [LibroID, UtenteID, borrowerName, loanDate, loanExpir]
    );
    
    // Aggiorna disponibilità libro
    await connection.query(
      "UPDATE libro SET isAvailable = false WHERE LibroID = ?",
      [LibroID]
    );
    
    await connection.commit();
    res.json({ message: "Prestito avviato", PrestitoID: loanResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error("Errore avvio prestito:", error);
    res.status(500).json({ error: "Errore nell'avvio del prestito" });
  } finally {
    connection.release();
  }
});

// 2. Termina prestito
app.delete("/api/loan/:id", async (req, res) => {
  const prestitoId = parseInt(req.params.id);
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Trova il LibroID del prestito
    const [prestito] = await connection.query(
      "SELECT LibroID FROM prestito WHERE PrestitoID = ?",
      [prestitoId]
    );
    
    if (prestito.length === 0) {
      return res.status(404).json({ message: "Prestito non trovato" });
    }
    
    // Elimina prestito
    await connection.query("DELETE FROM prestito WHERE PrestitoID = ?", [prestitoId]);
    
    // Rendi disponibile il libro
    await connection.query(
      "UPDATE libro SET isAvailable = true WHERE LibroID = ?",
      [prestito[0].LibroID]
    );
    
    await connection.commit();
    res.json({ message: "Prestito terminato" });
  } catch (error) {
    await connection.rollback();
    console.error("Errore termine prestito:", error);
    res.status(500).json({ error: "Errore nella terminazione del prestito" });
  } finally {
    connection.release();
  }
});

// 3. Estendi prestito
app.patch("/api/loan/:id/extend", async (req, res) => {
  const prestitoId = parseInt(req.params.id);
  
  try {
    // Estendi di un mese
    const [result] = await db.query(
      "UPDATE prestito SET loanExpir = DATE_ADD(loanExpir, INTERVAL 1 MONTH) WHERE PrestitoID = ?",
      [prestitoId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prestito non trovato" });
    }
    
    res.json({ message: "Prestito esteso di un mese" });
  } catch (error) {
    console.error("Errore estensione prestito:", error);
    res.status(500).json({ error: "Errore nell'estensione del prestito" });
  }
});

// 4. Modifica libro (solo dati libro)
app.patch("/api/book/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body; // Solo campi del libro, non prestito
  
  try {
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (author !== undefined) {
      updates.push("author = ?");
      values.push(author);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: "Nessun campo da aggiornare" });
    }
    
    values.push(id);
    
    const [result] = await db.query(
      `UPDATE libro SET ${updates.join(", ")} WHERE LibroID = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Libro non trovato" });
    }
    
    res.json({ message: "Libro aggiornato" });
  } catch (error) {
    console.error("Errore PATCH book", error);
    res.status(500).json({ error: "Errore modifica libro" });
  }
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

