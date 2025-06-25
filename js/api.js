
// Base = herkunft der API Daten
const BASE_URL = "https://pokeapi.co/api/v2";

// Export für script und limit damit nur 40 angezeigt werden und start bei Pokemon 1
export async function fetchAllPokemon({ limit = 40, offset = 0 } = {}) {
                                                        // Limit Übergabe
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}

export async function fetchPokemonByUrl(url = "") {
  const response = await fetch(url); // holt die Daten von der URL
  const data = await response.json();  // wandelt sie in ein nutzbares Objekt um
  return data;  // gibt das fertige Pokémon-Objekt zurück
}