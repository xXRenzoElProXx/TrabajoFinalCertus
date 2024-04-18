export const URL_API_POKEMON = "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0";

export const GetAllPokemon = async () => {
    try {
        const response = await fetch(URL_API_POKEMON);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        throw error;
    }
};

export const GetPokemonById = async (id) => {
    try {
        const response = await fetch(`${URL_API_POKEMON}/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching Pokemon with ID ${id}:`, error);
        throw error;
    }
};

export const GetPokemonsByType = async (type) => {
    const url = `https://pokeapi.co/api/v2/type/${type}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const GetPokemonsByStat = async (stat, direction) => {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0`;
        const response = await fetch(url);
        const data = await response.json();

        const allPokemonData = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return res.json();
            })
        );

        const sortedPokemon = allPokemonData
            .map((pokemon, index) => ({
                id: index + 1,
                name: pokemon.name,
                statValue: pokemon.stats.find((s) => s.stat.name === stat).base_stat,
            }))
            .filter((pokemon) => !isNaN(pokemon.statValue));
        if (direction === "asc") {
            sortedPokemon.sort((a, b) => a.statValue - b.statValue);
        } else {
            sortedPokemon.sort((a, b) => b.statValue - a.statValue);
        }

        return { results: sortedPokemon };
    } catch (error) {
        console.error(`Error fetching Pokémon by stat ${stat}:`, error);
        throw error;
    }
};
