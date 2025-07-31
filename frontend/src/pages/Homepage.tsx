import { useEffect, useState } from "react";
import { Link } from "react-router"; 
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUtenti } from "../redux/utenti/utentiThunk";

export default function Homepage() {
  const dispatch = useAppDispatch();
  const utenti = useAppSelector((state) => state.utenti.utenti);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUtenti());
  }, [dispatch]);

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

          <select
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="py-3 px-4 border rounded-xl bg-gray-100 text-indigo-700"
            defaultValue=""
          >
            <option value="" disabled>
              Seleziona un utente
            </option>
            {utenti.map((utente) => (
              <option key={utente.id} value={utente.id}>
                {utente.nomeCompleto}
              </option>
            ))}
          </select>

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
