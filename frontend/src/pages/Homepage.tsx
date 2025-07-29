import { Link } from "react-router";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-indigo-700">Benvenuto in Libreria</h1>
        <p className="text-gray-600">
          Esplora un mondo di letture. Accedi come <span className="font-semibold text-indigo-600">Admin</span> per gestire contenuti, oppure come <span className="font-semibold text-indigo-600">Utente</span> per scoprire nuovi libri.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/admin/home"
            className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Accedi come Admin
          </Link>
          <Link
            to="/user"
            className="bg-gray-200 text-indigo-700 py-3 rounded-xl hover:bg-gray-300 transition duration-300"
          >
            Accedi come Utente
          </Link>
        </div>
      </div>
    </div>
  );
}
