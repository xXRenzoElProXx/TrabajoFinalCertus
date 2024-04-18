import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetAllPokemon, GetPokemonsByType, GetPokemonsByStat } from "../../actions/pokemon.api";

const types = [
    "normal", "fighting", "flying", "poison", "ground",
    "rock", "bug", "ghost", "steel", "fire", "water",
    "grass", "electric", "psychic", "ice", "dragon",
    "dark", "fairy"
];

const stats = [
    { label: "HP", value: "hp" },
    { label: "Attack", value: "attack" },
    { label: "Defense", value: "defense" },
    { label: "Special Attack", value: "special-attack" },
    { label: "Special Defense", value: "special-defense" },
    { label: "Speed", value: "speed" }
];

const LoadingComponent = () => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-300 bg-opacity-50 z-50">
        <div className="flex justify-center items-center space-x-1 text-xl text-gray-700">
            <svg fill='none' className="w-8 h-8 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                <path clipRule='evenodd'
                    d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                    fill='currentColor' fillRule='evenodd' />
            </svg>
            <div>Cargando...</div>
        </div>
    </div>
);

const HomePage = () => {
    const [originalCharacters, setOriginalCharacters] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statFilter, setStatFilter] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [sortStat, setSortStat] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        GetAllPokemon().then(res => {
            if (res.results) {
                const pokemonWithId = res.results.map((pokemon, index) => ({
                    ...pokemon,
                    id: index + 1,
                }));
                setOriginalCharacters(pokemonWithId);
                setCharacters(pokemonWithId);
                setLoading(false);
            }
        });
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
        if (!statFilter) {
            const filteredPokemon = originalCharacters.filter(pokemon =>
                pokemon.name.toLowerCase().includes(value.toLowerCase())
            );
            setCharacters(filteredPokemon);
        }
    };

    const handleTypeFilter = () => {
        if (typeFilter && !statFilter) {
            if (typeFilter === "all") {
                setCharacters([...originalCharacters]);
            } else {
                setLoading(true);
                GetPokemonsByType(typeFilter).then(res => {
                    if (res.pokemon) {
                        const filteredPokemon = res.pokemon.map(pokemon => ({
                            name: pokemon.pokemon.name,
                            id: pokemon.pokemon.url.split("/").reverse()[1],
                        }));
                        setCharacters(filteredPokemon);
                        setLoading(false);
                    }
                });
            }
        }
    };

    const handleStatFilter = () => {
        if (statFilter) {
            const direction = statFilter === sortStat && sortDirection === "asc" ? "desc" : "asc";
            setSortStat(statFilter);
            setSortDirection(direction);

            setLoading(true);
            GetPokemonsByStat(statFilter, direction).then(res => {
                if (res.results) {
                    setCharacters(res.results);
                    setLoading(false);
                }
            });
        } else {
            setSortStat("");
            setSortDirection("");
            setCharacters([...originalCharacters]);
        }
    };

    useEffect(() => {
        handleTypeFilter();
        handleStatFilter();
    }, [typeFilter, statFilter]);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <LoadingComponent />
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">Pokémon</h1>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <input
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4 md:mb-0 shadow-md"
                        />
                        <div className="flex space-x-4">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-md"
                            >
                                <option value="all">Todos los tipos</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                value={statFilter}
                                onChange={(e) => setStatFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-md"
                            >
                                <option value="">Todas las estadísticas</option>
                                {stats.map((stat) => (
                                    <option key={stat.value} value={stat.value}>{stat.label}</option>
                                ))}
                            </select>
                            {sortStat && (
                                <button
                                    className="px-4 py-2 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white shadow-md"
                                    onClick={handleStatFilter}
                                >
                                    Ordenar {sortDirection === "asc" ? "↓" : "↑"}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {characters.map((pokemon) => (
                            <div key={pokemon.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
                                <Link to={`/pokemon/${pokemon.id}`}>
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                        alt={pokemon.name}
                                        onError={(e) => {
                                            console.log("Error loading image:", e);
                                        }}
                                        className="w-full"
                                    />
                                    <p className="text-center text-lg font-semibold text-blue-800">{pokemon.name}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;