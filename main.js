const model = {
    params: {
        baseUrl: 'https://pokeapi.co/api/v2/pokemon',
        limit: 9,
        offsetApiUrl: null,
        offset: null
    },

    listOfPokemons: [],

    listOfRecentlyViewedPokemons: [],

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
        reviewed_list: document.getElementById("reviewed__list"),

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
                listCard.addEventListener('click', () => this.showPokemonDescription(id));
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

        if (param === 'recently') {
            for (i in model.listOfRecentlyViewedPokemons) {
                let img = document.createElement('img');
                img.setAttribute('src', model.listOfRecentlyViewedPokemons[i].img);

                let id = model.listOfRecentlyViewedPokemons[i].id.toString();

                let idCard = document.createElement('div');

                let listCard = document.createElement('div');
                listCard.classList.add('list__card');
                listCard.addEventListener('click', () => this.showPokemonDescription(id));
                listCard.append(
                    img,
                    idCard,
                    name,
                );

                model.nodes.reviewed_list.appendChild(listCard);
            }
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

    getPokemon: (id, source) => {
        controller.getPokemonByIdOrName(id, source);
        controller.addRecentlyViewedPokemonToLocalStorage(id);
    },

    showPokemonDescription: function (id) {
        this.getPokemon(id, 'show_pokemon');
    },

    showError: function () {
        model.nodes.modalContent.textContent = '';
        model.nodes.pokemon = document.createElement('div');
        model.nodes.errorMessage.textContent = 'Pokemon no existe o compruebe su conexi??n a internet';
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

            // A??ade cada pok??mon iterado de getListOfPokemons
            // Esquiva a??adir pok??mon repetido al consultar por pok??mon individualmente
            if (!source) {
                model.listOfPokemons = [...model.listOfPokemons, pokemon];
            }

            // A??ade cada pok??mon iterado a listOfRecentlyViewedPokemons
            if (source === 'recently') {
                model.listOfRecentlyViewedPokemons = [...model.listOfRecentlyViewedPokemons, pokemon];
            }
        }

        // Renderiza unicamente el pok??mon consultado
        if (source === 'show_pokemon') {
            view.render('pokemon');
        }

        if (model.listOfPokemons.length % 9 === 0 && source !== 'recently' && source !== 'show_pokemon') {
            view.render('list');
            document.getElementById('spinner').style.display = 'none';
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
            await this.getPokemonByIdOrName(data.results[pokemon].name);
        }
    },

    getListOfRecentlyViewedPokemons: async function () {
        let recentlyViewedPokemonsInLocalStorage = JSON.parse(localStorage.getItem('recently-viewed-pokemons'))
        for (let recentlyPokemon in recentlyViewedPokemonsInLocalStorage) {
            await this.getPokemonByIdOrName(recentlyViewedPokemonsInLocalStorage[recentlyPokemon], 'recently');
        }
        view.render('recently');
    },

    addRecentlyViewedPokemonToLocalStorage: function (id) {
        let pokemonsInLocalStorage = JSON.parse(localStorage.getItem('recently-viewed-pokemons')) || [];
        pokemonsInLocalStorage.push(id);
        pokemonsInLocalStorage = [...new Set(pokemonsInLocalStorage)];
        localStorage.setItem('recently-viewed-pokemons', JSON.stringify(pokemonsInLocalStorage.slice(-3)));
    }
}


controller.getListOfPokemons();
controller.getListOfRecentlyViewedPokemons();

function addScrollListener() {
    window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight) {
            controller.getListOfPokemons();
            document.getElementById('spinner').style.display = 'block';
        }
    })
}
addScrollListener();