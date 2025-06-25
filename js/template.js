export function renderPokemon(pokemon) {
    console.log(pokemon)
    
  const name = pokemon.name;
  const id = pokemon.id.toString().padStart(4, "0");
  const image = pokemon.sprites.other["official-artwork"].front_default;

  // Wir holen alle Typen aus dem Array (z. B. grass, poison)
  const types = pokemon.types.map((t) => t.type.name);

  // HTML als String
  const html = `
    <div class="card">
     <img class="card-image" src="${image}" alt="${name}">
      <div class="card-number">No. ${id}</div>
      <div class="card-name">${name}</div> 
      <div class="card-types">
        ${types.map((type) => `<span class="type ${type}">${type}</span>`).join("")}
      </div>
    </div>
  `;

  return html;
console.log(pokemon.sprites.other["official-artwork"].front_default);
}
