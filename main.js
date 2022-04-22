const model = {
    params: {
        baseUrl: 'https://pokeapi.co/api/v2/pokemon',
        limit: 9,
        offsetApiUrl: null
    }
}

const view = {
    showPokemon: function (idOrName) {
        controller.getPokemonByIdOrName(idOrName);
    },

    showListOfPokemons: function () {
        controller.getListOfPokemons();
    }
}

const controller = {
    getPokemonByIdOrName: async function (idOrName) {
        let response = await fetch(model.params.baseUrl + '/' + idOrName);
        let data = await response.json();
        console.log(data.name);
    },

    getListOfPokemons: async function () {
        let firstCallUrl = model.params.baseUrl + '?limit=' + model.params.limit + '&offset=0';
        let response;
        model.params.offsetApiUrl
            ?
            response = await fetch(model.params.offsetApiUrl)
            :
            response = await fetch(firstCallUrl)
            ;
        let data = await response.json();
        model.params.offsetApiUrl = data.next;
        console.log(data.results)
    }
}

controller.getListOfPokemons();