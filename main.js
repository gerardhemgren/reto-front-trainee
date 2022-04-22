const model = {
    params: {
        baseUrl: 'https://pokeapi.co/api/v2/pokemon',
        limit: 9,
        offsetApiUrl: null,
        offset: null
    },

    listOfPokemons: [],

    pokemon: {
        id: null,
        name: null,
        weight: null,
        base_experience: null,
        img: null,
        types: [],
        stats: []
    }
}

const view = {
    showPokemon: function (idOrName, source) {
        controller.getPokemonByIdOrName(idOrName, source);
    },

    showListOfPokemons: function () {
        controller.getListOfPokemons();
    }
}

const controller = {
    getPokemonByIdOrName: async function (idOrName, source) {
        let response = await fetch(model.params.baseUrl + '/' + idOrName);
        let data = await response.json();

        let pokemon = {
            id: null,
            name: null,
            weight: null,
            base_experience: null,
            img: null,
            types: [],
            stats: []
        }

        pokemon.id = data.id;
        pokemon.name = data.name;
        pokemon.weight = data.weight;
        pokemon.base_experience = data.base_experience;
        pokemon.img = data.sprites.other["official-artwork"].front_default;
        pokemon.types = data.types;
        pokemon.stats = [
            { name: data.stats[0].stat.name, stat: data.stats[0].base_stat },
            { name: data.stats[1].stat.name, stat: data.stats[1].base_stat },
            { name: data.stats[2].stat.name, stat: data.stats[2].base_stat },
            { name: data.stats[5].stat.name, stat: data.stats[5].base_stat },
        ]

        model.pokemon = pokemon;
        model.listOfPokemons = [...model.listOfPokemons, pokemon];

        if (model.listOfPokemons.length === model.params.offset) {
            console.log(model.listOfPokemons);
        }
        if (source === 'show_pokemon') {
            console.log(pokemon);
        }
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

        for (let pokemon in data.results) {
            model.params.offset += 1;
            this.getPokemonByIdOrName(data.results[pokemon].name);
        }
    }
}

controller.getListOfPokemons();