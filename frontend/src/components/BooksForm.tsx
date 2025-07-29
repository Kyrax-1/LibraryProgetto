import { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { addBookAsync } from "../redux/booksThunks";

export default function FilmForm() {
  const dispatch = useAppDispatch();
  const [titleInput, setTitleInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (titleInput.trim() !== "" && authorInput.trim() !== "") {
      const newBookPayload = {
        title: titleInput,
        author: authorInput,
      };

      dispatch(addBookAsync(newBookPayload));
      setTitleInput("");
      setAuthorInput("");
    }
  }

  return (
  <div className="max-w-3xl mx-auto pb-6">
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto mt-8">
  <h2 className="text-2xl font-semibold text-indigo-700">Aggiungi un nuovo libro</h2>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
    <input
      type="text"
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={titleInput}
      onChange={(e) => setTitleInput(e.target.value)}
      placeholder="Titolo del libro"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Autore</label>
    <input
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={authorInput}
      onChange={(e) => setAuthorInput(e.target.value)}
      placeholder="Autore del libro"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300"
  >
    Aggiungi Libro
  </button>
</form>

  </div>
);
}
