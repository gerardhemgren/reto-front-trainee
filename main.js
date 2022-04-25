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
        stats: [{
            name: null,
            stat: null
        }]
    },

    nodes: {
        main: document.getElementById('main'),
        list: document.getElementById("list"),

        modal: document.getElementById("modal"),
        modalContent: document.getElementById("modal__content"),

        form: document.getElementById('form'),
        errorMessage: document.createElement('p')
    }
}

const view = {
    render: function (param) {
        if (param === 'pokemon') {
            model.nodes.modalContent.textContent = '';

            let img = document.createElement('img');
            img.setAttribute('src', model.pokemon.img);

            let name = document.createElement('div');
            name.textContent = model.pokemon.name;

            let weight = document.createElement('div');
            weight.textContent = `Weight: ${model.pokemon.weight}`;

            let baseExperience = document.createElement('div');
            baseExperience.textContent = `Base experience: ${model.pokemon.base_experience}`;

            let stats = document.createElement('div');
            stats.classList.add('modal__stats')
            for (s in model.pokemon.stats) {
                let stat = document.createElement('div');
                stat.textContent = `${model.pokemon.stats[s].name} ${model.pokemon.stats[s].stat}`;
                stats.appendChild(stat);
            }

            model.nodes.modalContent.append(
                img,
                name,
                weight,
                baseExperience,
                stats
            );

            this.openModal();
        }

        if (param === 'list') {
            this.clearList();
            for (i in model.listOfPokemons) {
                let img = document.createElement('img');
                img.setAttribute('src', model.listOfPokemons[i].img);

                let id = model.listOfPokemons[i].id.toString();

                let idCard = document.createElement('div');
                idCard.classList.add('card__id');
                idCard.textContent = id;

                let name = document.createElement('div');
                name.textContent = model.listOfPokemons[i].name;

                let types = document.createElement('div');
                for (t in model.listOfPokemons[i].types) {
                    let type = document.createElement('div');
                    type.textContent = model.listOfPokemons[i].types[t].type.name;
                    types.appendChild(type);
                }

                let listCard = document.createElement('div');
                listCard.classList.add('list__card');
                listCard.addEventListener('click', () => this.showPokemonDescription(id, 'show_pokemon_description'));
                listCard.append(
                    img,
                    idCard,
                    name,
                    types,
                );

                model.nodes.list.appendChild(listCard);
            }
            model.nodes.main.appendChild(list);
        }
    },

    clearList: () => {
        const range = document.createRange();
        range.selectNodeContents(model.nodes.list);
        range.deleteContents();
    },

    openModal: () => {
        model.nodes.modal.style.display = 'block';
        window.onclick = function (event) {
            if (event.target == model.nodes.modal) {
                model.nodes.modal.style.display = "none";
            }
        };
    },

    closeModal: () => {
        model.nodes.modal.style.display = 'none';
    },

    searchPokemon: () => {
        event.preventDefault();
        if (model.nodes.form.search.value !== '') {
            const input = model.nodes.form.search.value.toLowerCase();
            controller.getPokemonByIdOrName(input, 'show_pokemon');
        }
    },

    getPokemon: (idOrName, source) => {
        controller.getPokemonByIdOrName(idOrName, source);
    },

    showPokemonDescription: function (id, source) {
        controller.getPokemonByIdOrName(id, source);
    },

    showListOfPokemons: () => {
        controller.getListOfPokemons();
    },

    showError: function () {
        model.nodes.modalContent.textContent = '';
        model.nodes.pokemon = document.createElement('div');
        model.nodes.errorMessage.textContent = 'Pokemon no existe o compruebe su conexión a internet';
        model.nodes.modalContent.appendChild(model.nodes.errorMessage);
        this.openModal();
    }
}

const controller = {
    getPokemonByIdOrName: async function (idOrName, source) {
        if (source !== 'show_pokemon_description') {
            let response = await fetch(model.params.baseUrl + '/' + idOrName)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        view.showError();
                    }
                })
                .catch(() => {
                    view.showError();
                });

            if (response) {
                buildPokemon(response, 'any');
            }
        }
        else {
            let response = model.listOfPokemons.filter((pokemon) => pokemon.id === Number(idOrName))[0];
            buildPokemon(response, 'show_pokemon_description');
        }

        function buildPokemon(data, newSource) {
            switch (newSource) {
                case 'show_pokemon_description':
                    model.pokemon = {
                        id: data.id,
                        name: data.name,
                        weight: data.weight,
                        base_experience: data.base_experience,
                        img: data.img,
                        types: data.types,
                        stats: [
                            {
                                name: data.stats[0].name,
                                stat: data.stats[0].stat
                            },
                            {
                                name: data.stats[1].name,
                                stat: data.stats[1].stat
                            },
                            {
                                name: data.stats[2].name,
                                stat: data.stats[2].stat
                            },
                            {
                                name: data.stats[3].name,
                                stat: data.stats[3].stat
                            },
                        ]
                    };
                    break;

                case 'any':
                    model.pokemon = {
                        id: data.id,
                        name: data.name,
                        weight: data.weight,
                        base_experience: data.base_experience,
                        img: data.sprites.other["official-artwork"].front_default,
                        types: data.types,
                        stats: [
                            {
                                name: data.stats[0].stat.name,
                                stat: data.stats[0].base_stat
                            },
                            {
                                name: data.stats[1].stat.name,
                                stat: data.stats[1].base_stat
                            },
                            {
                                name: data.stats[2].stat.name,
                                stat: data.stats[2].base_stat
                            },
                            {
                                name: data.stats[5].stat.name,
                                stat: data.stats[5].base_stat
                            },
                        ]
                    };
            }

            // Renderiza unicamente el pokémon consultado
            if (source === 'show_pokemon' || source == 'show_pokemon_description') {
                view.render('pokemon');
            }
        }

        // Añade cada pokémon iterado de getListOfPokemons
        // Esquiva añadir pokémon repetido al consultar por pokémon individualmente
        if (!source) {
            model.listOfPokemons = [...model.listOfPokemons, model.pokemon];
        }

        // Espera a completar la lista de pokémons llamados antes de renderizarla
        if (model.listOfPokemons.length !== model.params.offset) {
            view.render('list');
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

        data.results.forEach(pokemon => {
            model.params.offset += 1;
            this.getPokemonByIdOrName(pokemon.name);
        })
    },
}

controller.getListOfPokemons();

function addScrollListener() {
    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        if ((clientHeight + scrollTop) > scrollHeight - 1) {
            if (model.listOfPokemons.length >= 9) {
                controller.getListOfPokemons();
            }
        }
    })
}
addScrollListener()