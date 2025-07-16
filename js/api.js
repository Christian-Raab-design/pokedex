
// Base = herkunft der API Daten
const BASE_URL = "https://pokeapi.co/api/v2";

// Export für script und limit damit nur 36 angezeigt werden und start bei Pokemon 1
export async function fetchAllPokemon({ limit = 36, offset = 0 } = {}) {
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




const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("searchResult");

let allPokemon = [];

async function loadAllPokemon() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        const data = await res.json();
        allPokemon = data.results; // [{ name, url }]
    } catch (err) {
        console.error("Fehler beim Laden der Pokémon-Liste", err);
    }
}

function showLoading(state) {
    document.getElementById("loadingSpinner").style.display = state ? "block" : "none";
}

function displayPokemon(pokemon) {
    searchResult.innerHTML += `
        <div>
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
    `;
}

searchInput.addEventListener("input", () => {
    searchBtn.disabled = searchInput.value.trim().length < 3;
});

searchBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    searchResult.innerHTML = '';

    if (query.length < 3) return;

    const matched = allPokemon.filter(p => p.name.includes(query));

    if (matched.length === 0) {
        searchResult.innerHTML = `<p>Kein passendes Pokémon gefunden.</p>`;
        return;
    }

    showLoading(true);

    try {
        for (let p of matched) {
            const res = await fetch(p.url);
            const data = await res.json();
            displayPokemon(data);
        }
    } catch (err) {
        searchResult.innerHTML = `<p>Fehler beim Abrufen der Daten.</p>`;
    } finally {
        showLoading(false);
    }
});

// Lade alle Pokémon beim Start
loadAllPokemon();

let offset = 0;
const limit = 20;

document.getElementById("loadMoreBtn").addEventListener("click", async () => {
    const btn = document.getElementById("loadMoreBtn");
    const spinner = document.getElementById("loadingSpinner");

    btn.disabled = true;
    spinner.style.display = "block";

    await loadPokemon(offset, limit);
    offset += limit;

    spinner.style.display = "none";
    btn.disabled = false;
});

async function loadPokemon(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    for (const p of data.results) {
        const res = await fetch(p.url);
        const pokeData = await res.json();
        displayPokemon(pokeData); // kannst du anpassen an dein Layout
    }
}
