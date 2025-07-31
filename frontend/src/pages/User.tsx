import { NavLink, Outlet } from "react-router";
import Navbar from '../components/Navbar';


export default function User() {
return (
    <div className="bg-gray-50">
      {/* Navbar fissa */}
      <Navbar />

      {/* Contenuto sotto la navbar */}
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        {/* Intestazione */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">Benvenuto nella tua libreria!</h1>

          {/* Link secondari: Home / I miei libri */}
          <ul className="flex gap-6 border-b border-gray-200 pb-2 mt-4">
            <li>
              <NavLink
                to="home"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-700 font-semibold border-b-2 border-indigo-700"
                    : "text-gray-500 hover:text-indigo-600"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                  to = "prestiti"
                  className={({ isActive }) =>
                    isActive
                      ? "text-indigo-700 font-semibold border-b-2 border-indigo-700"
                      : "text-gray-500 hover:text-indigo-600"
                  }
                >
                  Prestiti
                </NavLink>
            </li>
          </ul>
        </header>

        {/* Contenuto dinamico */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}