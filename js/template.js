function renderPokemon(pokemon) {
  const name = pokemon.name;
  const id = pokemon.id.toString().padStart(4, "0");
  const image = pokemon.sprites.other["official-artwork"].front_default;
  const type = pokemon.types[0].type.name;
  const types = pokemon.types.map((t) => t.type.name);
 

// Design for the Pokemon Card

  const html = `
    <div class="card" onclick="openOverlay(${pokemon.id})">
      <img class="card-image ${type}" src="${image}" alt="${name}">
      <div class="card-number">No. ${id}</div>
      <div class="card-name">${name}</div> 
      <div class="card-types">
        ${types.map((type) => `<span class="type ${type}">${type}</span>`).join("")}
      </div>
    </div>
  `;
  return html;
}


// Design for the Overlay with Tabs

function renderOverlay(pokemon) {
  const name = pokemon.name;
  const id = pokemon.id.toString().padStart(4, "0");
  const image = pokemon.sprites.other["official-artwork"].front_default;
  const types = pokemon.types.map((t) => t.type.name);
  const type = pokemon.types[0].type.name;

  const height = pokemon.height;
  const weight = pokemon.weight;
  const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

  const html = `
<div class="overlay-card ${type}">
  <div class="overlay-top">
    <div class="overlay-controls">
      <span class="prev" id="prev" onclick="PrevPokemon()"><i class="arrow left"></i></span>
      <span class="next" id="next" onclick="NextPokemon()"><i class="arrow right"></i></span>
    </div>
    <div class="overlay-header">
      <div class="header-left">
        <h2>${name}</h2>
        <div class="overlay-types">
          ${types.map(type => `<span class="type ${type}">${type}</span>`).join("")}
        </div>
      </div>
      <div class="header-right">
        <span class="overlay-id">#${id}</span>
      </div>
    </div>
    <img class="overlay-image" src="${image}" alt="${name}">
  </div>

  <div class="overlay-bottom">
    <div class="overlay-tabs">
      <button class="tab active" onclick="switchTab('about')">About</button>
      <button class="tab" onclick="switchTab('stats')">Stats</button>
      <button class="tab" onclick="switchTab('evolution')">Evolution</button>
      <button class="tab" onclick="switchTab('moves')">Moves</button>
    </div>

    <div id="overlay-content" class="overlay-content"></div>
  </div>
</div>
  `;
  return html;
}


// About Tab

function renderTabAbout(pokemon) {
  return `
    <table class="info-table">
      <tr><td>Species:</td><td>${pokemon.name}</td></tr>
      <tr><td>Height:</td><td>${pokemon.height / 10} m</td></tr>
      <tr><td>Weight:</td><td>${pokemon.weight / 10} kg</td></tr>
      <tr><td>Abilities:</td><td>${pokemon.abilities.map(a => a.ability.name).join(", ")}</td></tr>
    </table>
  `;
}


// Stats Tab

function renderTabStats(pokemon) {
  return `
    <table class="info-table">

      ${pokemon.stats.map((stat, i) => `
        <tr><td>${stat.stat.name.replace("-", " ")}:</td>
        <td style="width: 100%;">
          <div class="stat-bar">
            <div class="stat-fill" style="width: ${stat.base_stat}%;"></div>
          </div>
        </td></tr>
      `).join("")}

    </table>
  `;
}


// Evolution Tab

function renderTabEvolution(pokemonList) {
  return `
    <div class="evolutionChain">
      ${pokemonList.map(pokemon => {
        const image = pokemon.sprites.other['official-artwork'].front_default;
        const name = pokemon.name;
        const type = pokemon.types[0].type.name;

        return `
          <div class="evo_Poke">
            <div class="circle ${type}">
              <img class="evolutionImage" src="${image}" alt="${name}">
            </div>
            <div class="evo-name">${name}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}




// Moves Tab

function renderTabMoves(pokemon) {
  const moves = pokemon.moves.map(m => m.move.name).slice(0, 10);

  return `
    <div class="moves-container">
      ${moves.map(move => `<span class="move-pill">${move}</span>`).join("")}
    </div>
  `;
}