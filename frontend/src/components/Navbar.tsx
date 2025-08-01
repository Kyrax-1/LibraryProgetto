import { useLocation, Link, useParams } from "react-router";
import { useAppSelector } from "../redux/hooks";

export default function Navbar() {
  const location = useLocation();
  const { utenteId } = useParams(); // Recupera l'ID dell'utente dai parametri URL
  const isAdmin = location.pathname.includes("/admin");

  // Recupera gli utenti dal Redux store
  const utenti = useAppSelector((state) => state.utenti.utenti);
  const utentiLoading = useAppSelector((state) => state.utenti.loading);

  // Trova l'utente specifico se non è admin
  const utente = !isAdmin && utenteId ? utenti.find(u => u.id === parseInt(utenteId)) : null;

  // Determina il nome da mostrare
  const displayName = isAdmin
    ? "Admin"
    : utentiLoading
      ? "Caricamento..."
      : (utente?.nomeCompleto || "Utente");

  const profileImg = isAdmin
    ? "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" // Immagine admin
    : "https://cdn-icons-png.flaticon.com/512/2922/2922561.png"; // Immagine utente

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between fixed top-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-indigo-700">
        <Link to={isAdmin?"/admin/home":`/user/${utenteId}/home`}>Libreria</Link>
      </div>

      {/* Sezione destra */}
      <div className="flex items-center space-x-6">
        <Link to={"/"}>
          <button className="border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-100 transition">
            LogOut
          </button>
        </Link>
        <p className="border-gray-300 px-4 py-1 rounded-md text-gray-600 bg-gray-50">
          Benvenuto, {displayName}
        </p>

        <img
          src={profileImg}
          alt="Profilo"
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300 cursor-pointer"
        />
      </div>
    </nav>
  );
}