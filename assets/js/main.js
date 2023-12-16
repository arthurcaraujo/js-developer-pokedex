const modal = document.getElementById("modal");
const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

let offset = 0;
const limit = 10;
const maxRecords = 151;
let newPokemonApiArray = [];

function showModal() {modal.style.display = "block"}
function hideModal() {modal.style.display = "none"}

hideModal();

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `
                        <li class="type ${type}">${type}</li>
                    `).join('')}
                </ol>

                <img alt="${pokemon.name}" src="${pokemon.photo}">
            </div>
        </li>
    `
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        const newPokemonPageList = [...pokemonList.children];

        pokemons.map(pokemon => newPokemonApiArray.push(pokemon));

        newPokemonPageList.map((item, index) => item.addEventListener("click", () => {
            showModal();
            newPokemonApiArray.map(pokemon => {
                if (pokemon.number === index + 1) {
                    modal.innerHTML = `
                        <div class="modal-background" onclick="hideModal()"></div>
                        <div class="modal-card ${pokemon.type}">
                            <span
                                class="modal-close-btn"
                                onclick="hideModal()"
                            >
                                &times;
                            </span>
                            <span class="modal-poke-name">${pokemon.name}</span>
                            <span class="modal-poke-num">#${pokemon.number}</span>

                            <ul class="modal-poke-types">
                                ${pokemon.types.map((type) => `
                                    <li class="type ${type}">${type}</li>
                                `).join('')}
                            </ul>

                            <img alt="${pokemon.name}" src="${pokemon.photo}">

                            <table class="modal-poke-details">
                                <tr class="height">
                                    <th>Height</th>
                                    <td>${pokemon.height} cm</td>
                                </tr>
                                <tr class="weight">
                                    <th>Weight</th>
                                    <td>${pokemon.weight} kg</td>
                                </tr>
                                <tr class="abilities">
                                    <th>Abilities</th>
                                    <td>${pokemon.abilities.join(", ")}</td>
                                </tr>
                            </table>
                        </div>
                    `
                }
            })
        }))
    })
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
})