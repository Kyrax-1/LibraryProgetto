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

// GET tutti i libri con info prestito
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
        p.PrestitoID as loanId,  
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

// GET prestito specifico per libro
app.get("/api/book/:id/loan", async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const [rows] = await db.query(`
            SELECT 
                p.PrestitoID as id,
                p.borrowerName,
                DATE_FORMAT(p.loanDate, '%Y-%m-%d') as loanDate,
                DATE_FORMAT(p.loanExpir, '%Y-%m-%d') as loanExpir
            FROM prestito p
            WHERE p.LibroID = ? AND p.loanExpir > NOW()
            LIMIT 1
        `, [bookId]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error("Errore GET prestito libro:", error);
    res.status(500).json({ error: "Errore nel recupero prestito" });
  }
});

// POST aggiungi book
app.post("/api/book", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { title, author } = req.body;
    if (!title?.trim() || !author?.trim()) {
      await connection.rollback();
      return res.status(400).json({ error: "Title e author sono obbligatori" });
    }

    // Query semplificata (il DB gestirà ID e disponibilità)
    const [result] = await connection.query(
      `INSERT INTO libro (title, author) VALUES (?, ?)`,
      [title.trim(), author.trim()]
    );

    // Verifica inserimento
    if (!result.insertId) {
      await connection.rollback();
      return res.status(500).json({ error: "Inserimento fallito" });
    }

    // Recupera il libro appena creato
    const [newBook] = await connection.query(
      `SELECT 
        LibroID as id,
        title,
        author,
        isAvailable
       FROM libro WHERE LibroID = ?`,
      [result.insertId]
    );

    await connection.commit();
    res.status(201).json(newBook[0]);
  } catch (error) {
    await connection.rollback();
    console.error("Errore DB:", error.sqlMessage || error.message);
    res.status(500).json({ 
      error: "Errore database",
      details: error.sqlMessage 
    });
  } finally {
    connection.release();
  }
});

// DELETE rimuovi book
app.delete("/api/book/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "ID libro non valido" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Elimina prima eventuali prestiti associati
    await connection.query(
      "DELETE FROM prestito WHERE LibroID = ?",
      [id]
    );

    // 2. Poi elimina il libro
    const [result] = await connection.query(
      "DELETE FROM libro WHERE LibroID = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Libro non trovato" });
    }

    await connection.commit();
    res.json({
      success: true,
      message: "Libro eliminato con successo",
      bookId: id
    });
  } catch (error) {
    await connection.rollback();
    console.error("Errore DELETE book:", error);
    res.status(500).json({
      error: "Errore eliminazione libro",
      details: {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      }
    });
  } finally {
    connection.release();
  }
});

// MODIFICA libro
// 1. Avvia prestito
app.post("/api/loan", async (req, res) => {
  const { LibroID, UtenteID, borrowerName, loanDate, loanExpir } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    console.log("pre insert into")

    // Inserisci prestito
    const [loanResult] = await connection.query(
      "INSERT INTO prestito (LibroID, UtenteID, borrowerName, loanDate, loanExpir) VALUES (?, ?, ?, ?, ?)",
      [LibroID, UtenteID, borrowerName, loanDate, loanExpir]
    );
    console.log("insert into query")

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

    const [updatedBooks] = await db.query(
      `SELECT * FROM libro WHERE LibroID = ?`,
      [id]
    );
    res.json(updatedBooks[0]);
    console.log("Res query: ", updatedBooks);
    // res.json({ message: "Libro aggiornato" });
  } catch (error) {
    console.error("Errore PATCH book", error);
    res.status(500).json({ error: "Errore modifica libro" });
  }
});

//RECUPERO UTENTI
app.get("/api/utenti", async (req, res) => {
  try {
    console.log("Tentativo di recupero utenti...");

    // JOIN LEFT per includere tutti i gli utenti
    const [rows] = await db.query(`
      SELECT * FROM utente
    `);

    console.log("Utenti recuperati:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Errore GET utenti - Dettagli completi:", error);
    console.error("Errore message:", error.message);
    console.error("Errore code:", error.code);
    res.status(500).json({ error: "Errore nel recupero utenti" });
  }
});



// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

