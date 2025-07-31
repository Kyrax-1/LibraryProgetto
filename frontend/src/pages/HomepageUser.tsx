import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import BooksList from "../components/BooksList";
import { useParams } from "react-router";

interface Props {
    onSearch: (query: string) => void;
}

export default function HomepageUser() {
    const par = useParams();
    console.log(par)

    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        (query.trim());
    };

    return (
        <div>
            {/* Search */}
            <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm max-w-md w-full mb-6">
                <SearchIcon className="text-gray-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Cerca un libro o autore..."
                />
            </form>
            <BooksList></BooksList>
        </div>
    );
}
