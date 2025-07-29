import { NavLink, Outlet } from "react-router";
import Navbar from "../components/Navbar";



export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fissa */}
      <Navbar />

      {/* Contenuto pagina (sotto la navbar) */}
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        {/* Titolo pagina */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">Gestisci la biblioteca.</h1>

          {/* Link secondari: Home / Prestiti */}
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


          <div>
            <Outlet></Outlet>
          </div>


  
      </div>
    </div>
  );
}
