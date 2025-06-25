import { fetchAllPokemon, fetchPokemonByUrl } from './api.js';
import { renderPokemon } from './template.js';





async function init() {
  const container = document.getElementById('pokemonContainer'); // In die Seite einfügen
  const list = await fetchAllPokemon(); // Import der ersten 40 Pokemon

  let allHTML = ''; //Hier wird alles gesammelt
  
  for (let i = 0; i < 40; i++) {
    const pokemon = await fetchPokemonByUrl(list[i].url);   // Funktion um die Daten bei der API abzurufen ab Pokemon 1 (Liste bzw. Array) also hier "https://pokeapi.co/api/v2/pokemon/1/";
    allHTML += renderPokemon(pokemon); // HTML für das Pokémon bauen
  }

container.innerHTML = allHTML; // alles einfügen

}

init();