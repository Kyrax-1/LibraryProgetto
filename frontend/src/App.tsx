import './index.css';
import { Route, Routes } from 'react-router';
import Admin from './pages/Admin';
import Homepage from './pages/Homepage';
import User from './pages/User';
import HomepageAdmin from './pages/HomepageAdmin';
import PrestitiAdmin from './pages/PrestitiAdmin';
import HomepageUser from './pages/HomepageUser';
import PrestitiUser from './pages/PrestitiUser';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* Rotte protette per l'Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Admin />}>
            <Route path="home" element={<HomepageAdmin />} />
            <Route path="prestiti" element={<PrestitiAdmin />} />
          </Route>
        </Route>

        {/* Rotte protette per l'Utente */}
        {/* L'ID utente nella URL è corretto, ma l'accesso è comunque verificato dal ruolo */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}> {/* Un admin può vedere le pagine user se necessario */}
          <Route path="/user/:utenteId" element={<User />}>
            <Route path="home" element={<HomepageUser />} />
            <Route path="prestiti" element={<PrestitiUser />} />
          </Route>
        </Route>
      </Routes>
    </div>

  )
}

export default App;
