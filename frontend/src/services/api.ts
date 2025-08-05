import axios from 'axios';
import { logout } from '../redux/utenti/utentiSlice'; // Mantieni questa importazione per l'azione di logout

let storeInstance: any; // Dichiaralo ma non inizializzarlo qui

// Funzione per impostare l'istanza dello store
export const setInterceptorsStore = (newStore: any) => {
  storeInstance = newStore;
};

// Recupera l'URL base dalla variabile d'ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercettore di richieste: aggiunge il token JWT all'header Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    if (storeInstance) {
      const state = storeInstance.getState();
      const token = state.utenti.token; // Accedi al token dallo slice utenti
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercettore di risposte: gestisce errori 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Errore di autenticazione/autorizzazione:", error.response.data.message || error.message);
      // Dispatch l'azione di logout solo se lo store è disponibile
      if (storeInstance && typeof window !== 'undefined') { // Aggiunto typeof window !== 'undefined' per ambienti non-browser
        storeInstance.dispatch(logout());
        // Puoi anche reindirizzare l'utente alla pagina di login qui se vuoi
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;