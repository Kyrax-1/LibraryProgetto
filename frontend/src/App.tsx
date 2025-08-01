import './index.css';
import { Route, Routes } from 'react-router';
import Admin from './pages/Admin';
import Homepage from './pages/Homepage';
import User from './pages/User';
import HomepageAdmin from './pages/HomepageAdmin';
import PrestitiAdmin from './pages/PrestitiAdmin';
import HomepageUser from './pages/HomepageUser';
import PrestitiUser from './pages/PrestitiUser';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="home" element={<HomepageAdmin />} />
          <Route path="prestiti" element={<PrestitiAdmin />} />
        </Route>
        <Route path="/user/:utenteId" element={<User />}>
          <Route path="home" element={<HomepageUser />} />
          <Route path="prestiti" element={<PrestitiUser />} />
        </Route>
      </Routes>
    </div>

  )
}

export default App;



/* const dispatch = useAppDispatch();

  const books = useAppSelector((state) => state.book.items);
  const loading = useAppSelector((state) => state.book.loading);
  const error = useAppSelector((state) => state.book.error);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

   return (
    <>
      <h1>PROVA GET</h1>

      {loading && (
        <p className="text-blue-400 animate-pulse text-sm mb-4">
          Caricamento dei libri in corso...
        </p>
      )}

      {error && (
        <p className="text-red-500 font-semibold mb-4">
          Errore: {error}
        </p>
      )}

      <div className="space-y-4">
        {!loading && !error && books.map((book: Book) => (
          <div key={book.id}>
            <BookItem book={book} />
          </div>
        ))}
      </div>
    </>
  );  */