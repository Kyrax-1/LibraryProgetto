import BooksList from "../components/BooksList";
import Navbar from '../components/Navbar';


export default function User() {
  return (
    <div>
      <div>
        <Navbar/>
        <h1 >Library </h1>
        <p>
          Gestisci la Biblioteca.
        </p>
      </div>
      <main>
        <BooksList/>
      </main>
    </div>
  );
}