// src/features/utenti/utenteThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUtenti = createAsyncThunk(
  'utenti/fetchUtenti',
  async () => {
    const response = await fetch('/api/utenti');
    if (!response.ok) {
      throw new Error('Errore nel recupero utenti');
    }

    const data = await response.json();
    console.log("dati: "+ data)

    // Mappiamo i dati per restituire solo UtenteID e Nome + Cognome
    return data.map((utente: any) => ({
      id: utente.UtenteID,
      nomeCompleto: `${utente.Nome} ${utente.Cognome}`,
    }));
  }
);
