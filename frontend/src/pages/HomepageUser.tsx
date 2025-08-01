import { useState } from "react";
import BooksList from "../components/BooksList";

export default function HomepageUser() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="p-6 pt-5">
            <div className="flex justify-center mb-8">
                <form 
                    onSubmit={handleSubmit} 
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm max-w-md w-full hover:shadow-md transition-shadow"
                >
                    {/* Icona Search Emoji */}
                    <span className="text-gray-500 text-lg">🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                        placeholder="Cerca un libro o autore..."
                    />
                    {/* Pulsante per cancellare la ricerca */}
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </form>
            </div>

            {/* Mostra query di ricerca attiva */}
            {searchQuery.trim() && (
                <div className="mb-4 text-center">
                    <p className="text-gray-600 text-sm">
                        Risultati per: <span className="font-medium text-indigo-600">"{searchQuery.trim()}"</span>
                        <button 
                            onClick={clearSearch}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 underline text-sm"
                        >
                            Cancella ricerca
                        </button>
                    </p>
                </div>
            )}

            {/* Lista dei libri con query di ricerca */}
            <BooksList searchQuery={searchQuery.trim()} />
        </div>
    );
}