
// === API Pokedex ===

const BASE_URL = "https://pokeapi.co/api/v2";


// Load 36 Pokemon

async function fetchAllPokemon({ limit = 36, offset = 0 } = {}) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}


// Loading Pokemon Details

async function fetchPokemonByUrl(url = "") {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


// Loading Pokemon Evolution Data

async function fetchEvolutionChainUrl(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();
  return speciesData.evolution_chain.url;
}


// Loading Pokemon over Name

async function fetchPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data;
}

let loadedCount = 0; // Saving loaded pokemon
let loadedPokemon = []; // loaded Pokemon
let currentPokemon = null; // Current Pokemon
console.log(loadedPokemon)


// Initial loadin of the first 36 Pokemons

async function init() {
  showLoading(); 

  const container = document.getElementById('pokemonContainer');
  const list = await fetchAllPokemon({ limit: 36, offset: loadedCount });

  let allHTML = '';

  for (let i = 0; i < list.length; i++) {
    const pokemon = await fetchPokemonByUrl(list[i].url);
    loadedPokemon.push(pokemon);
    allHTML += renderPokemon(pokemon);
  }

  container.innerHTML = allHTML;
  loadedCount += 36;

  hideLoading(); 
}


// Load More (36 Pokemon per loading)

async function loadMore() {
  const container = document.getElementById('pokemonContainer');
  showLoading();

  const list = await fetchAllPokemon({ limit: 36, offset: loadedCount });

  let allHTML = '';
  for (let i = 0; i < list.length; i++) {
    const pokemon = await fetchPokemonByUrl(list[i].url);
    allHTML += renderPokemon(pokemon);
  }

  container.innerHTML += allHTML;
  loadedCount += 36;

  hideLoading();
}


// Open Overlay on Cardclick and check the ID

function openOverlay(id) {
  const overlay = document.getElementById('overlay');

  const selectedPokemon = findPokemonById(id);
  if (selectedPokemon) {
    renderOverlayForPokemon(selectedPokemon, overlay);
  }
}


  // Loop through loadedPokemon to find the correct Pokemon by ID

function findPokemonById(id) {
  for (let i = 0; i < loadedPokemon.length; i++) {
    if (loadedPokemon[i].id === id) {
      return loadedPokemon[i];
    }
  }
  return null;
}


// Render Overlay 

function renderOverlayForPokemon(pokemon, overlayElement) {
  const html = renderOverlay(pokemon);
  overlayElement.innerHTML = html;
  overlayElement.classList.remove('hidden');

   // Saving the Pokemon global
  currentPokemon = pokemon;
  // Show About - First Impression in Overlay
  showTab('about');
}


// Open & Close Overlay

function handleOverlayClick(event) {
  if (event.target.id === 'overlay') {
    closeOverlay();
  }
}


// Close Overlay

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hidden');
  overlay.innerHTML = ''; // Inhalt leeren
}


// Evolution Pokemon Name

function extractEvolutionNames(chain) {
  const names = [];

  const first = chain;
  const second = first?.evolves_to?.[0];
  const third = second?.evolves_to?.[0];

  if (first) names.push(first.species.name); // First Evo (Bisasam)
  if (second) names.push(second.species.name); // Second Evo (Bisaknosp)
  if (third) names.push(third.species.name); // Third Evo (Bisaflor)
  return names;
}


async function loadEvolution(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url); // Pokemon Species Data 
  const speciesData = await speciesResponse.json();
  const evoUrl = speciesData.evolution_chain.url; // Evolution Chain

  const evoResponse = await fetch(evoUrl); 
  const evoData = await evoResponse.json();

  const names = extractEvolutionNames(evoData.chain); // Name extraction for later use


  // Loop through each Pokemon + save in evolutionData

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

// Chaing Tabs in Card Overlay

function switchTab(tabName) {
  const tabs = document.getElementsByClassName('tab');
  const content = document.getElementById('overlay-content');

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  // Change Tab
  if (tabName === 'about') {
    tabs[0].classList.add('active');
    showTab(tabName);
  } else if (tabName === 'stats') {
    tabs[1].classList.add('active');
    showTab(tabName);
  } else if (tabName === 'evolution') {
    tabs[2].classList.add('active');
    showTab('evolution'); 
  } else if (tabName === 'moves') {
      tabs[3].classList.add('active');
      showTab(tabName);
  }
}

// Card Navigation Arrows

function PrevPokemon() {
  // Find Pokemon in Index 
  let index = loadedPokemon.findIndex(function(pokemon) {
    return pokemon.id === currentPokemon.id;
  });

  // One Step back -> on first Pokemon go to the end
  index = index - 1;
  if (index < 0) {
    index = loadedPokemon.length - 1;
  }

  // Open Overlay for the previous card
  let previousPokemon = loadedPokemon[index];
  openOverlay(previousPokemon.id);
}

function NextPokemon() {
  // Find Pokemon in Index 
  let index = loadedPokemon.findIndex(function(pokemon) {
    return pokemon.id === currentPokemon.id;
  });

  // One step forward on the end go to the first
  index = index + 1;
  if (index >= loadedPokemon.length) {
    index = 0;
  }

  // Open Overlay for teh next
  let nextPokemon = loadedPokemon[index];
  openOverlay(nextPokemon.id);
}

// Loading Screen

function showLoading() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden");
}
