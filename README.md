#  Pokémon app
## Reto front-trainee

## MVC

**MODEL**

**params**
Contiene los parámetros a utilizar en **getListOfPokemons**, tiene la posibilidad de cambiar la cantidad de pokémones solicitados en cada llamada. (en futura versión de la app este parámetro podría ser elegido por parte del usuario)

**listOfPokemons**
Almacena todos los pokémones que han sido solicitados.
En futura versión de la app, cada vez que se llame a **getPokemonByIdOrName**, primero se buscaría dentro de éste listado, si no lo encuentra entonces la app haría una solicitud al servidor.

**pokemon**
Es el molde que contiene todos los atributos que definen al pokemon, molde utilizado por **getPokemonByIdOrName**.

**nodes**
Contiene elementos a crear dentro del DOM.
Quizás sea conveniente ubicarlos dentro de la **VISTA**.
(Se ubicaron dentro del model pensando en que iban a ser tratados como un objeto buscando evitar la duplicación de código en la función render de la vista).


**VIEW**

**render**
Es la función principal de la app, renderiza la lista de pokémones y la tarjeta individual de cada pokémon.
Se encargar de crear los nodos para el DOM.

Parámetros:
- param: type string, es la referencia para que la vista renderice un listado de pokémones o la tarjeta individual.
En futura versión quizas sea más claro usar un switch statement en vez de dos if statements.

**Las otras funciones ayudan al renderizado y su comunicación con los controllers.**


**CONTROLLERS**

**getPokemonByIdOrName**:
Descripción:
Realiza una petición (fetch) a la 'pokeapi'.
Su finalidad es encontrar un solo pokémon en la base de datos a consultar, obtener sus atributos, armar el objeto pokémon y alojarlo dentro del modelo **pokemon**.

Parámetros: 
- idOrName: type string, puede ser el id o el nombre, parámetro obligatorio del endpoint. 
- source: type string, es un parámetro adicional, para que el controlador evalue si la petición responde a 
    - una búsqueda desde el formulario,
    - una selección del listado de tarjetas de pokémones,
    - un recorrido desde el controlador **getListOfPokemons**

**getListOfPokemons**:
Descripción:
Realiza una petición (fetch) a la 'pokeapi'.
Su finalidad es obtener 9 pokémones, y dejar lista la ruta del próximo pedido, el cual traería los 9 pokémones siguientes.

La ruta del fetch se armará dependiendo de si es la primera consulta desde que se inicia la aplicación, o del estado del offset (lleva la cuenta de la cantidad de pokémones que se han pedido anteriormente).

A su vez, llama a **getPokemonByIdOrName** para armar el modelo de cada uno de los 9 pokémones.


## OBSERVACIONES
El endpoint de cada pokémon, devuelve varios links de imagenes del pokémon con distintos pesos de bytes.
Se podría solicitar las de menor tamaño en el armado del listado de cada objeto pokémon. Cuando se solicita la descripción se podría hacer una nueva petición y agregar la imagen principal "official-artwork" dentro del modelo pokemon.

## URL:
[URL](https://gerardhemgren.github.io/reto-front-trainee/)
