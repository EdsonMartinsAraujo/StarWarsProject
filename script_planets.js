let currentPageUrl = 'https://swapi.dev/api/planets/'

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)

};


async function loadCharacters(url) {
    const mainContent = document.getElementById ('main-content')
    mainContent.innerHTML = ''; //limpar os resultados anteriores

    try {

      const response = await fetch(url);
      const responseJson = await response.json();

      responseJson.results.forEach(async (planets) => {
        const card = document.createElement("div")
        let urlImg = `https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg`;
        const response = await fetch(urlImg)
        if(response.status == '404'){
            urlImg = './assets/placeholder.jpg'
        }
        card.style.backgroundImage = `url('${urlImg}')`
        card.className = "cards"

        const characterNameBG = document.createElement("div")
        characterNameBG.className = "character-name-bg"

        const characterName = document.createElement("span")
        characterName.className = "character-name"
        characterName.innerText = `${planets.name}`

        characterNameBG.appendChild(characterName)
        card.appendChild(characterNameBG)

        card.onclick = () => {
            const modal = document.getElementById('modal')
            modal.style.visibility = "visible"

            const modalContent = document.getElementById("modal-content")
            modalContent.innerHTML = ''

            const characterImage = document.createElement("div")
            characterImage.style.backgroundImage = `url('${urlImg}')`
            characterImage.className = "character-image"

            const name = document.createElement("span")
            name.className = "character-details"
            name.innerText = `Nome: ${planets.name}`
           
            const planetPopulation = document.createElement("span")
            planetPopulation.className = "character-details"
            planetPopulation.innerText = `Populacao: ${convertPlanetPopulation(planets.population)}`

            const climate = document.createElement("span")
            climate.className = "character-details"
            climate.innerText = `Clima: ${convertTraductor(planets.climate)}`

            const terrain = document.createElement("span")
            terrain.className = "character-details"
            terrain.innerText = `Terreno: ${convertTraductorII(planets.terrain)}`

            const diameter = document.createElement("span")
            diameter.className = "character-details"
            diameter.innerText = `Diametro: ${convertDiameter(planets.diameter)}`
            
            modalContent.appendChild(characterImage)
            modalContent.appendChild(name)
            modalContent.appendChild(planetPopulation)
            modalContent.appendChild(climate)
            modalContent.appendChild(terrain)
            modalContent.appendChild(diameter)
            
        }

        mainContent.appendChild(card)
      });

      const nextButton = document.getElementById('next-button')
      const backButton = document.getElementById('back-button')

      nextButton.disabled = !responseJson.next
      backButton.disabled = !responseJson.previous

      backButton.style.visibility = responseJson.previous? "visible" : "hidden"

      currentPageUrl = url
         
    } catch (error) {
      alert('Erro ao carregar os Planetas')
      console.log(error)
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
    const response = await fetch(currentPageUrl)
    const responseJson = await response.json()
    
    await loadCharacters(responseJson.next)

    }catch (error){
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
    const response = await fetch(currentPageUrl)
    const responseJson = await response.json()
    
    await loadCharacters(responseJson.previous)

    }catch (error){
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertPlanetPopulation (planetPopulation){
    if (planetPopulation === "unknown"){
        return"Desconhecido" 
    }
    return planetPopulation.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function convertDiameter (diameter){
    if (diameter === "unknown"){
        return"Desconhecido" 
    }
    return `${diameter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} km`

}
function convertTraductor(climate){
    const traducao = {
        arid: "arido",
        temperate: "temperado",
        "temperate, tropical": "temperado, tropical",
        frozen: "congelado" ,
        murky: "obscuro",
        "temperate, arid": "temperado, arido",
        "temperate, arid, windy": "temperado, arido, ventoso",
        hot: "quente",
        "artificial temperate": "temperado artificial",
        frigid: "frigido",
        "hot, humid": "quente, umido",
        "temperate, moist": "temperado, umido",
        polluted: "poluido",
        unknown: "desconhecido",
        superheated: "superaquecido",
        "arid, temperate, tropical": "arido, temperado, tropical",
        "temperate, arid, subartic": "temperado, arido, subártico",
        "temperate, artic": "temperado, artico",
        "tropical, temperate": "tropical, temperado",
        "arid, rocky, windy": "arido, rochoso, ventoso",
        

    };

    return traducao[climate] || climate;
}

function convertTraductorII(terrain){
    const traducaoII = {
        desert: "deserto",
        "grasslands, mountains": "pastagens, montanhas",
        "jungle, rainforests": "selva, florestas tropicais",
        "tundra, ice caves, mountain ranges": "tundra, cavernas de gelo, cadeias de montanhas",
        "swamp, jungles": "pantano, selvas",
        "gas giant": "gigante de gas",
        "forests, mountains, lakes": "florestas, montanhas, lagos",
        "grassy hills, swamps, forests, mountains": "colinas gramadas, pântanos, florestas, montanhas",
        "cityscape, mountains": "paisagem urbana, montanhas",
        ocean: "oceano",
        "rock, desert, mountain, barren": "rocha, deserto, montanha, arido",
        "scrublands, savanna, canyons, sinkholes": "matos, savanas, canions, sumidouros",
        "volcanoes, lava rivers, mountains, caves": "vulcoes, rios de lava, montanhas, cavernas",
        "jungle, forests, lakes, rivers": "selva, florestas, lagos, rios",
        "airless asteroid": "asteroide sem ar",
        "glaciers, mountains, ice canyons": "geleiras, montanhas, canions de gelo",
        "fungus forests": "florestas de fungos",
        "mountains, fields, forests, rock arches": "montanhas, campos, florestas, arcos rochosos",
        "caves, desert, mountains, volcanoes": "cavernas, deserto, montanhas, vulcoes",
        grass:  "grama",
        cityscape: "paisagem urbana",
        "plains, urban, hills, forests": "planicies, urbanas, colinas, florestas",
        "jungles, oceans, urban, swamps": "selvas, oceanos, urbanos, pantanos",
        "urban, oceans, swamps, bogs": "urbano, oceanos, pântanos, brejos",
        "oceans, savannas, mountains, grasslands": "oceanos, savanas, montanhas, pastagens",
        "rocky islands, oceans": "ilhas rochosas, oceanos",
        "plains, seas, mesas": "planicies, mares, mesas",
        unknown: "desconhecido",
        "mountains, seas, grasslands, deserts": "montanhas, mares, pastagens, desertos",
        "deserts, mountains": "desertos, montanhas",
        "oceans, reefs, islands": "oceanos, recifes, ilhas",
        "plains, forests":  "planicies, florestas",
        "mountains, volcanoes, rocky deserts": "montanhas, vulcoes, desertos rochosos",
        "swamps, lakes": "pântanos, lagos",
        "swamps, deserts, jungles, mountains": "pantanos, desertos, selvas, montanhas",
        "forests, deserts, savannas": "florestas, desertos, savanas",
        "mountains, valleys, deserts, tundra": "montanhas, vales, desertos, tundra",
        "urban, barren":"urbano, arido",
        "desert, tundra, rainforests, mountains": "deserto, tundra, florestas tropicais, montanhas",
        "barren, ash": "esteril, cinza",
        "toxic cloudsea, plateaus, volcanoes": "mar nublado toxico, planaltos, vulcoes",
        verdant: "verdejante",
        "lakes, islands, swamps, seas": "lagos, ilhas, pantanos, mares",
        "rocky canyons, acid pools": "canions rochosos, piscinas acidas",
        rocky: "rochoso",
        "oceans, rainforests, plateaus": "oceanos, florestas tropicais, planaltos",
        deserts: "desertos",
        "rainforests, rivers, mountains": "florestas tropicais, rios, montanhas",
        "jungles, forests, deserts": "selvas, florestas, desertos",
        "oceans, glaciers": "oceanos, geleiras",
        "urban, vines": "urbano, vinhas",
        "plains, forests, hills, mountains": "planicies, florestas, colinas, montanhas",
        "cities, savannahs, seas, plains": "cidades, savanas, mares, planicies",
        "rainforests, cliffs, canyons, seas": "florestas tropicais, falesias, canions, mares"     
        
    };

    return traducaoII[terrain] || terrain;
}
