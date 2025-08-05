// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from './../redux/hooks'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[]; // Ruoli permessi
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isLoggedIn, user, loading } = useAppSelector((state) => state.utenti);

  // Se i dati stanno ancora caricando (ad esempio, al refresh della pagina,
  // mentre Redux sta reidratando lo stato da localStorage), non reindirizzare subito.
  // Puoi mostrare uno spinner o un messaggio di caricamento qui.
  if (loading) {
    return <div>Caricamento in corso...</div>; // O un componente spinner
  }

  // Se l'utente non è loggato, reindirizza alla homepage (pagina di login)
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Se sono specificati ruoli permessi e l'utente non ha uno di quei ruoli,
  // reindirizza a una pagina di accesso negato o alla homepage.
  if (allowedRoles && user && !allowedRoles.includes(user.role as 'admin' | 'user')) {
    // Potresti voler reindirizzare a una pagina "Accesso Negato"
    console.warn(`Accesso negato: utente ${user.email} con ruolo ${user.role} ha tentato di accedere a una risorsa per ruoli: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; // O ad esempio, '/access-denied'
  }

  // Se tutto è a posto, renderizza il contenuto della rotta
  return <Outlet />;
};

export default ProtectedRoute;