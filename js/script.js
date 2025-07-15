
// === API Funktionen (aus pokedex API) ===

const BASE_URL = "https://pokeapi.co/api/v2";


// Laden von 36 Pokemon

async function fetchAllPokemon({ limit = 36, offset = 0 } = {}) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}


// Lädt die kompletten Daten des Pokemon

async function fetchPokemonByUrl(url = "") {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


// Laden der Evolution 

async function fetchEvolutionChainUrl(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();
  return speciesData.evolution_chain.url;
}


// Lädt den Pokemon über den Namen

async function fetchPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data;
}

let loadedCount = 0; // Globale speicherung der Pokemon
let loadedPokemon = []; // Geladene Pokemon
let currentPokemon = null; // Aktueller Pokemon
console.log(loadedPokemon)


// Initiales laden der Pokemons

async function init() {
  const container = document.getElementById('pokemonContainer'); // HTML Element aus der Index
  const list = await fetchAllPokemon({ limit: 36, offset: loadedCount }); // Hole 36 Pokémon-URLs

  let allHTML = ''; // HTML leeren

  // Details des Pokemon laden
  for (let i = 0; i < list.length; i++) {
    const pokemon = await fetchPokemonByUrl(list[i].url);
    loadedPokemon.push(pokemon); // Speichere für Overlay
    allHTML += renderPokemon(pokemon); // Erzeuge HTML
  }

  container.innerHTML = allHTML;
  loadedCount += 36; // Zähler erhöhen
}


// Mehr Pokemon laden (Immer 36 für Optik)

async function loadMore() {
const container = document.getElementById('pokemonContainer'); // In die Seite einfügen
  const list = await fetchAllPokemon({ limit: 36, offset: loadedCount }); // Import der ersten 40 Pokemon

  let allHTML = ''; //Hier wird alles gesammelt

for (let i = 0; i < list.length; i++)  {
     const pokemon = await fetchPokemonByUrl(list[i].url);  
    allHTML += renderPokemon(pokemon);
  }

   container.innerHTML += allHTML; // nicht ersetzen, sondern anhängen!
  loadedCount += 36; // Zähler wird um 36 erhöht
} 

loadMore = loadMore;
console.log("Aktueller loadedCount:", loadedCount);


// OVERLAY 

function openOverlay(id) {
  const overlay = document.getElementById('overlay'); // Overlay aus Index

  // Mit for-Schleife durch loadedPokemon gehen, um das richtige Pokémon zu finden
  let selectedPokemon = null;
  for (let i = 0; i < loadedPokemon.length; i++) {
    if (loadedPokemon[i].id === id) {
      selectedPokemon = loadedPokemon[i];
      break;
    }
  }

  // Rendern Overlay mit Pokemon
  if (selectedPokemon) {
    const html = renderOverlay(selectedPokemon);
    overlay.innerHTML = html;
    overlay.classList.remove('hidden');

     // Das Pokémon global speichern, für Tabs
    currentPokemon = selectedPokemon;

    // Zeigt About als ersten Tab
    showTab('about');
  }
}


// Open & Close Overlay

function handleOverlayClick(event) {
  if (event.target.id === 'overlay') {
    closeOverlay();
  }
}


// Overlay schließen

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hidden');
  overlay.innerHTML = ''; // Inhalt leeren
}


// Evolution Namen der Pokemons

function extractEvolutionNames(chain) {
  const names = [];

  const first = chain;
  const second = first?.evolves_to?.[0];
  const third = second?.evolves_to?.[0];

  if (first) names.push(first.species.name); // Erste Stufe (z. B. Bisasam)
  if (second) names.push(second.species.name); // Zweite Stufe (z. B. Bisaknosp)
  if (third) names.push(third.species.name); // Dritte Stufe (z. B. Bisaflor)
  return names;
}


async function loadEvolution(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url); // Species Daten des Pokemon
  const speciesData = await speciesResponse.json();
  const evoUrl = speciesData.evolution_chain.url; // Liste der Evolutionskette

  const evoResponse = await fetch(evoUrl); // Kenne in JSON 
  const evoData = await evoResponse.json();

  const names = extractEvolutionNames(evoData.chain); // Hier wird der Name extrahiert um ihn weiter nutzen zu können


  // Schleife durch jedes Pokemon + speicherung in evolutionData

  const evolutionData = [];

  for (let name of names) {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    const evoPokemon = await response.json();
    evolutionData.push(evoPokemon);
  }

  return evolutionData;
}


// TABS IN OVERLAY

function showTab(tabName) {
  const content = document.getElementById('overlay-content');

  if (tabName === 'about') {
    content.innerHTML = renderTabAbout(currentPokemon);
  }

  if (tabName === 'stats') {
    content.innerHTML = renderTabStats(currentPokemon);
  }

  if (tabName === 'evolution') {
    loadEvolution(currentPokemon).then((evoList) => {
      content.innerHTML = renderTabEvolution(evoList);
    });
  }

  if (tabName === 'moves') {
  content.innerHTML = renderTabMoves(currentPokemon);
}
}

// Funktion für das wechseln der Tabs

function switchTab(tabName) {
  const tabs = document.getElementsByClassName('tab');
  const content = document.getElementById('overlay-content');

  // Alle Buttons deaktivieren (active entfernen)
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  // Tab wechseln und aktiv machen
  if (tabName === 'about') {
    tabs[0].classList.add('active');
    showTab(tabName);
  } else if (tabName === 'stats') {
    tabs[1].classList.add('active');
    showTab(tabName);
  } else if (tabName === 'evolution') {
    tabs[2].classList.add('active');
    showTab('evolution'); // das übernimmt alles zentral
  } else if (tabName === 'moves') {
      tabs[3].classList.add('active');
      showTab(tabName);
  }
}


// Navigationspfeile

function PrevPokemon() {
  // Finde die Position des aktuellen Pokémons in der Liste
  let index = loadedPokemon.findIndex(function(pokemon) {
    return pokemon.id === currentPokemon.id;
  });

  // Gehe ein Pokémon zurück. Wenn wir am Anfang sind, gehe ans Ende.
  index = index - 1;
  if (index < 0) {
    index = loadedPokemon.length - 1;
  }

  // Öffne das Overlay für das vorherige Pokémon
  let previousPokemon = loadedPokemon[index];
  openOverlay(previousPokemon.id);
}

function NextPokemon() {
  // Finde die Position des aktuellen Pokémons in der Liste
  let index = loadedPokemon.findIndex(function(pokemon) {
    return pokemon.id === currentPokemon.id;
  });

  // Gehe ein Pokémon weiter. Wenn wir am Ende sind, gehe zum Anfang.
  index = index + 1;
  if (index >= loadedPokemon.length) {
    index = 0;
  }

  // Öffne das Overlay für das nächste Pokémon
  let nextPokemon = loadedPokemon[index];
  openOverlay(nextPokemon.id);
}




// Suchfunktion

function startSearch() {


}
