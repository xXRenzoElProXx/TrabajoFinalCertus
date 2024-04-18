import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Character = () => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPokemon, setCurrentPokemon] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon}`);
                const data = await response.json();
                setPokemon(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate("/"); // Cambiar a la página principal en caso de error
            }
        };
        fetchPokemon();
    }, [currentPokemon, navigate]);

    const handleAtras = () => {
        setCurrentPokemon(prevPokemon => prevPokemon - 1);
        navigate(`/pokemon/${currentPokemon - 1}`); // Cambiar a la URL del Pokémon anterior
    };

    const handleSiguiente = () => {
        setCurrentPokemon(prevPokemon => prevPokemon + 1);
        navigate(`/pokemon/${currentPokemon + 1}`); // Cambiar a la URL del siguiente Pokémon
    };

    const handleRegresarPrincipal = () => {
        navigate("/"); // Cambiar a la página principal de la aplicación
    };

    const calcularLongitudBarra = (statValue, maxValue, barLength) => {
        return (statValue / maxValue) * barLength;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-md border border-gray-300 m-4">
                {loading ? (
                    <div className="p-4 text-gray-600 text-center">Cargando...</div>
                ) : pokemon ? (
                    <div className="p-4 text-center">
                        <h1 className="text-3xl font-bold mb-2 text-blue-800 uppercase">{pokemon.name}</h1>
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="mx-auto mb-4 rounded-lg shadow-md"
                            style={{ maxWidth: "200px" }}
                        />
                        <p className="text-gray-700">Altura: {pokemon.height / 10} m</p>
                        <p className="text-gray-700">Peso: {pokemon.weight / 10} kg</p>
                        <p className="text-gray-700">Tipo(s): {pokemon.types.map(type => type.type.name).join(', ')}</p>
                        <p className="text-gray-700">Habilidades: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                        <p className="text-gray-700">Estadísticas:</p>
                        <ul className="text-left list-disc pl-4 text-gray-700">
                            {pokemon.stats.map(stat => (
                                <li key={stat.stat.name}>
                                    {stat.stat.name}: {stat.base_stat}
                                    <div className="w-full h-2 bg-gray-300 rounded mt-1">
                                        <div
                                            className="h-full bg-blue-500 rounded"
                                            style={{ width: `${calcularLongitudBarra(stat.base_stat, 200, 100)}%` }}
                                        ></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
                                onClick={handleAtras}
                            >
                                Atrás
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md"
                                onClick={handleSiguiente}
                            >
                                Siguiente
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-md"
                                onClick={handleRegresarPrincipal}
                            >
                                Regresar al Menú
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-gray-600 text-center">No se encontraron datos del Pokémon</div>
                )}
            </div>
        </div>
    );
};
