const model = {
    pokemon: {
        id: null,
        name: null
    },
}

const view = {
    showPokemonInConsole: function () {
        console.log(model.pokemon);
    }
}

const controller = {
    getPokemonByIdOrName: async function (idOrName) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        let data = await response.json();
        model.pokemon.name = data.name;
        view.showPokemonInConsole();
    }
}

controller.getPokemonByIdOrName('charmander');