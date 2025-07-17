let allPokemonNames = []; // Global load allm Pokemon for search

// Check input length / min 3 Letters + Autostart
function checkSearchLength() {
  const input = document.getElementById("searchInput").value.trim();
  const button = document.getElementById("searchBtn");

  if (input.length >= 3) {
    button.disabled = false;
    searchPokemon(); // Start the search after 3 letters
  } else {
    button.disabled = true;
  }
}

// Load all names at Start
async function loadAllNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const data = await response.json();
  allPokemonNames = data.results.map(p => p.name);
}
loadAllNames();


// Search Function
function searchPokemon() {
  const input = getSearchInput();
  if (input.length < 3) return false;

  disableSearchUI();
  startSearch(input);
  return false; 
}

// Get input from inputfield 
function getSearchInput() {
  return document.getElementById("searchInput").value.trim().toLowerCase();
}

// Loading Spinner and deactivate search
function disableSearchUI() {
  document.getElementById("searchBtn").disabled = true;
  document.getElementById("pokemonContainer").innerHTML = "";
  showLoading();
}

// Open search when finished
function enableSearchUI() {
  document.getElementById("searchBtn").disabled = false;
  hideLoading();
}

// Seach Function
async function startSearch(input) {
  const container = document.getElementById("pokemonContainer");
  const matches = allPokemonNames.filter(name => name.startsWith(input));

  if (matches.length === 0) {
    container.innerHTML = "<p>No Pokémon found.</p>";
    enableSearchUI();
    return;
  }

  let allHTML = "";
  for (let name of matches) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    allHTML += renderPokemon(data);
  }

  container.innerHTML = allHTML;
  enableSearchUI();
}
