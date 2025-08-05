// src/pages/Homepage.tsx
import React, { useState, useEffect } from "react"; // Assicurati di importare useEffect
import { useNavigate } from "react-router"; // Useremo useNavigate per la navigazione
import { Link } from "react-router";
import api from "../services/api"; // Importa il nostro servizio API
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // Useremo Redux
import { loginSuccess, logout } from "../redux/utenti/utentiSlice";

// Rimuovi l'importazione di fetchUtenti se non la usi più
// import { fetchUtenti } from "../redux/utenti/utentiThunk"; // Rimuovi o commenta

export default function Homepage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Ottieni lo stato di login da Redux
  const isLoggedIn = useAppSelector((state) => state.utenti.isLoggedIn);
  const user = useAppSelector((state) => state.utenti.user); // Recupera l'utente dallo stato Redux

  const [tabValue, setTabValue] = useState(0);

  // Stato per il form di Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Stato per il form di Registrazione
  const [regNome, setRegNome] = useState("");
  const [regCognome, setRegCognome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Usa useEffect per reindirizzare se l'utente è già loggato
  useEffect(() => {
    if (isLoggedIn && user) { // Se l'utente è già loggato e abbiamo i dati utente
      if (user.role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate(`/user/${user.id}/home`);
      }
    }
  }, [isLoggedIn, user, navigate]); // Dipendenze per useEffect

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setLoginError(null);
    setRegError(null);
    setRegSuccess(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);

    try {
      const response = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const { token, user } = response.data; // Assicurati che il tuo backend restituisca 'user' con il campo 'role'

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(loginSuccess({ token, user }));

      console.log("Login riuscito:", response.data);

      // Logica di reindirizzamento basata sul ruolo
      if (user && user.role) {
        if (user.role === 'admin') {
          navigate('/admin/home');
        } else { // Presumiamo 'user' per qualsiasi altro ruolo
          navigate(`/user/${user.id}/home`);
        }
      } else {
        // Fallback se il ruolo non è definito o altri problemi
        navigate("/homepage-user"); // Pagina generica se il ruolo non è chiaro
      }
    } catch (error: any) {
      console.error("Errore di login:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError("Credenziali non valide. Riprova.");
      }
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    try {
      const response = await api.post("/auth/register", {
        nome: regNome,
        cognome: regCognome,
        email: regEmail,
        password: regPassword,
      });

      console.log("Registrazione riuscita:", response.data);
      setRegSuccess("Registrazione completata con successo! Ora puoi effettuare il login.");
      setTabValue(0);
      setLoginEmail(regEmail);
      setRegNome("");
      setRegCognome("");
      setRegEmail("");
      setRegPassword("");
    } catch (error: any) {
      console.error("Errore di registrazione:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setRegError(error.response.data.error);
      } else {
        setRegError("Errore durante la registrazione. Riprova.");
      }
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setLoginEmail(email);
    setLoginPassword(password);
    await handleLogin({ preventDefault: () => { } } as React.FormEvent);
  };

  // Se l'utente è già loggato (e useEffect ha reindirizzato), non mostrare la homepage
  if (isLoggedIn && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-6">
      <Paper elevation={8} sx={{ borderRadius: "16px", maxWidth: "450px", width: "100%", p: 4, textAlign: "center", boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "indigo.700", fontWeight: "bold", mb: 3 }}>
          Benvenuto in Libreria
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Accedi o registrati per esplorare un mondo di letture.
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 4, '.MuiTabs-indicator': { backgroundColor: 'indigo.600' } }}
        >
          <Tab label="Login" />
          <Tab label="Registrazione" />
        </Tabs>

        {tabValue === 0 && ( // Form di Login
          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            {loginError && (
              <Typography color="error" variant="body2">
                {loginError}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5, borderRadius: "8px", bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' } }}
            >
              Accedi
            </Button>
            <Button
              variant="text"
              onClick={() => handleQuickLogin("guest@example.com", "password123")}
              sx={{ mt: 2, color: 'indigo.600' }}
            >
              Accedi come Visitatore
            </Button>

            <Button
              variant="text"
              onClick={() => handleQuickLogin("admin@example.com", "password123")}
              sx={{ color: 'purple.600' }}
            >
              Accedi come Admin Demo
            </Button>
          </Box>
        )}

        {tabValue === 1 && ( // Form di Registrazione
          <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={regNome}
              onChange={(e) => setRegNome(e.target.value)}
              required
            />
            <TextField
              label="Cognome"
              variant="outlined"
              fullWidth
              value={regCognome}
              onChange={(e) => setRegCognome(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            {regError && (
              <Typography color="error" variant="body2">
                {regError}
              </Typography>
            )}
            {regSuccess && (
              <Typography color="primary" variant="body2" sx={{ color: 'success.main' }}>
                {regSuccess}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              sx={{ py: 1.5, borderRadius: "8px", bgcolor: 'purple.600', '&:hover': { bgcolor: 'purple.700' } }}
            >
              Registrati
            </Button>
          </Box>
        )}
      </Paper>
    </div>
  );
}