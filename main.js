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
    },

    nodes: {
        main: document.getElementById('main'),
        list: document.getElementById("list"),
        listCard: null,
        showDescriptionButton: null,

        pokemon: null,
        modal: document.getElementById("modal"),
        modalContent: document.getElementById("modal__content"),

        form: document.getElementById('form'),
        errorMessage: document.createElement('p')
    }
}

const view = {
    clearList: () => {
        const range = document.createRange();
        range.selectNodeContents(model.nodes.list);
        range.deleteContents();
    },

    render: function (param) {
        if (param === 'pokemon') {
            model.nodes.modalContent.textContent = '';
            model.nodes.pokemon = document.createElement('div');
            model.nodes.pokemon.textContent = model.pokemon.name;
            model.nodes.modalContent.appendChild(model.nodes.pokemon);
            this.openModal();
        }

        if (param === 'list') {
            this.clearList();
            for (i in model.listOfPokemons) {
                model.nodes.pokemon = document.createElement('div');
                model.nodes.pokemon.textContent = model.listOfPokemons[i].name;

                let id = model.listOfPokemons[i].id.toString();
                model.nodes.showDescriptionButton = document.createElement('button');
                model.nodes.showDescriptionButton.setAttribute('id', id);
                model.nodes.showDescriptionButton.addEventListener('click', () => this.showPokemonDescription(id));
                model.nodes.showDescriptionButton.textContent = 'Info';

                model.nodes.listCard = document.createElement('div');
                model.nodes.listCard.classList.add('list__card')
                model.nodes.listCard.appendChild(model.nodes.pokemon);
                model.nodes.listCard.appendChild(model.nodes.showDescriptionButton);
                model.nodes.list.appendChild(model.nodes.listCard);
                
            }
            model.nodes.main.appendChild(list);
        }
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
            controller.getPokemonByIdOrName(model.nodes.form.search.value, 'show_pokemon');
        }
    },

    getPokemon: (idOrName, source) => {
        controller.getPokemonByIdOrName(idOrName, source);
    },

    showPokemonDescription: function (id) {
        this.getPokemon(id, 'show_pokemon');
    },

    showListOfPokemons: () => {
        controller.getListOfPokemons();
    },

    showError: function () {
        model.nodes.pokemon.textContent = '';
        model.nodes.errorMessage.textContent = 'Pokemon no existe o compruebe su conexión a internet';
        model.nodes.modalContent.appendChild(model.nodes.errorMessage);
        this.openModal();
    }
}

const controller = {
    getPokemonByIdOrName: async function (idOrName, source) {
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

        let data = response;
        if (data) {
            buildPokemon();
        }

        function buildPokemon() {
            let pokemon = {
                id: data.id,
                name: data.name,
                weight: data.weight,
                base_experience: data.base_experience,
                img: data.sprites.other["official-artwork"].front_default,
                types: data.types,
                stats: [
                    { name: data.stats[0].stat.name, stat: data.stats[0].base_stat },
                    { name: data.stats[1].stat.name, stat: data.stats[1].base_stat },
                    { name: data.stats[2].stat.name, stat: data.stats[2].base_stat },
                    { name: data.stats[5].stat.name, stat: data.stats[5].base_stat },
                ]
            };
            model.pokemon = pokemon;

            // Añade cada pokémon iterado de getListOfPokemons
            // Esquiva añadir pokémon repetido al consultar por pokémon individualmente
            if (!source) {
                model.listOfPokemons = [...model.listOfPokemons, pokemon];
            }

            // Espera a completar la lista de pokémons llamados antes de renderizarla
            if (model.listOfPokemons.length === model.params.offset && source !== 'show_pokemon') {
                view.render('list');
            }

            // Renderiza unicamente el pokémon consultado
            if (source === 'show_pokemon') {
                view.render('pokemon');
            }
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

function addScrollListener() {
    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        if ((clientHeight + scrollTop) > scrollHeight - 0.5) {
            if (model.listOfPokemons.length >= 9) {
                controller.getListOfPokemons();
            }
        }
    })
}
addScrollListener()