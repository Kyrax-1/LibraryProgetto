import { useEffect, useState, useRef } from "react";
import { Link } from "react-router"; 
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUtenti } from "../redux/utenti/utentiThunk";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const utenti = useAppSelector((state) => state.utenti.utenti);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("Seleziona un utente");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchUtenti());
  }, [dispatch]);

  // Chiude il dropdown se si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (userId: number, userName: string) => {
    setSelectedId(userId);
    setSelectedUser(userName);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-indigo-700">Benvenuto in Libreria</h1>
        <p className="text-gray-600">
          Esplora un mondo di letture. Accedi come <span className="font-semibold text-indigo-600">Admin</span> per gestire contenuti, oppure seleziona un <span className="font-semibold text-indigo-600">Utente</span> per scoprire nuovi libri.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/admin/home"
            className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Accedi come Admin
          </Link>

          <div className="relative" ref={dropdownRef}>
            {/* Select button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl text-indigo-700 font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 transition-all duration-300 shadow-sm flex items-center justify-between"
            >
              <span className={selectedId ? "text-indigo-700" : "text-indigo-500"}>
                {selectedUser}
              </span>
              <svg 
                className={`w-5 h-5 text-indigo-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-indigo-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {utenti.map((utente) => (
                  <button
                    key={utente.id}
                    onClick={() => handleUserSelect(utente.id, utente.nomeCompleto)}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 text-indigo-700 border-b border-indigo-100 last:border-b-0 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {utente.nomeCompleto.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{utente.nomeCompleto}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedId !== null && (
            <Link
              to={`/user/${selectedId}/home`}
              className="bg-gray-200 text-indigo-700 py-3 rounded-xl hover:bg-gray-300 transition duration-300"
            >
              Accedi come Utente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}