let currentPageUrl = 'https://swapi.dev/api/species/'

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

      responseJson.results.forEach(async (species) => {
        const card = document.createElement("div")
        let urlImg = `https://starwars-visualguide.com/assets/img/species/${species.url.replace(/\D/g, "")}.jpg`;
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
        characterName.innerText = `${convertTraductor(species.name)}`

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
            name.innerText = `Especie: ${convertTraductor(species.name)}`
           
            const classification = document.createElement("span")
            classification.className = "character-details"
            classification.innerText = `Classificacao: ${convertTraductorII(species.classification)}`

            const language = document.createElement("span")
            language.className = "character-details"
            language.innerText = `linguagem: ${species.language}`

            const averageLifespan = document.createElement("span")
            averageLifespan.className = "character-details"
            averageLifespan.innerText = `Tempo medio de vida: ${convertAverageLifespan(species.average_lifespan)}`

            const averageHeight = document.createElement("span")
            averageHeight.className = "character-details"
            averageHeight.innerText = `Media Altura: ${convertAverageHeight(species.average_height)} m`

            modalContent.appendChild(characterImage)
            modalContent.appendChild(name)
            modalContent.appendChild(classification)
            modalContent.appendChild(language)
            modalContent.appendChild(averageLifespan)
            modalContent.appendChild(averageHeight)
            
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
      alert('Erro ao carregar os personagens')
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
function convertAverageHeight(averageHeight){
    if (averageHeight === "unknown") {
        return "desconhecida"
    }
        return (averageHeight / 100).toFixed(2);
}
function convertAverageLifespan(averageLifespan){
    if (averageLifespan === "unknown") {
        return "desconhecido"
    }
    else if (averageLifespan === "indefinite"){
            return "indefinido"
        }
    
        return averageLifespan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function convertTraductor(characterName){
    const traducao = {
        Human: "humano",
        Mammal: "mamifero",
        Droid: "Androide",
        Sentient: "autoconsciente",
        Gastropod: "gastropode",
        Reptile: "reptil"
    };

    return traducao[characterName] || characterName;
}

function convertTraductorII(classification){
    const traducaoII = {
        human: "humano",
        mammal: "mamifero",
        mammals: "mamifero(a)",
        droid: "Androide",
        sentient: "autoconsciente",
        gastropod: "gastropode",
        reptile: "reptil",
        unknown: "Desconhecido",
        amphibian: "anfibio",
        insectoid: "insetoide",
        reptilian: "reptiliano"

    };

    return traducaoII[classification] || classification;
}