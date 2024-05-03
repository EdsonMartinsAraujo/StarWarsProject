let currentPageUrl = 'https://swapi.dev/api/films/'

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

      responseJson.results.forEach((films) => {
        const card = document.createElement("div")
        card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/films/${films.url.replace(/\D/g, "")}.jpg')`
        card.className = "cards"

        const characterNameBG = document.createElement("div")
        characterNameBG.className = "character-name-bg"

        const characterName = document.createElement("span")
        characterName.className = "character-name"
        characterName.innerText = `${convertTraductor(films.title)}`

        characterNameBG.appendChild(characterName)
        card.appendChild(characterNameBG)

        card.onclick = () => {
            const modal = document.getElementById('modal')
            modal.style.visibility = "visible"

            const modalContent = document.getElementById("modal-content")
            modalContent.innerHTML = ''

            const characterImage = document.createElement("div")
            characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/films/${films.url.replace(/\D/g, "")}.jpg')`
            characterImage.className = "character-image"

            const title = document.createElement("span")
            title.className = "character-details"
            title.innerText = `Titulo: ${convertTraductor(films.title)}`

            const titleUSA = document.createElement("span")
            titleUSA.className = "character-details"
            titleUSA.innerText = `Titulo original: ${films.title}`
            
            const episodeId = document.createElement("span")
            episodeId.className = "character-details"
            episodeId.innerText = `Episodio: ${films.episode_id}`

            const releaseDate = document.createElement("span")
            releaseDate.className = "character-details"
            releaseDate.innerText = `Ano Lancamento: ${convertReleseDate(films.release_date)}`

            const director = document.createElement("span")
            director.className = "character-details"
            director.innerText = `Diretor: ${films.director}`

            const producer = document.createElement("span")
            producer.className = "character-details"
            producer.innerText = `Producao: ${films.producer}`

            modalContent.appendChild(characterImage)
            modalContent.appendChild(title)
            modalContent.appendChild(titleUSA)
            modalContent.appendChild(episodeId)
            modalContent.appendChild(releaseDate)
            modalContent.appendChild(director)
            modalContent.appendChild(producer)
            
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
      alert('Erro ao carregar os Filmes')
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

function convertReleseDate(releaseDate){
    const brDate = new Date(releaseDate);
    const newBrDate = brDate.toLocaleDateString('pt-BR',{timeZone: 'UTC',});

    return newBrDate
}
function convertTraductor(characterName){
    const traducao = {
        "A New Hope": "uma nova esperanca",
        "The Empire Strikes Back": "o imperio contra ataca",
        "Return of the Jedi": "o retorno de jedi",
        "The Phantom Menace": "a ameaca fantasma",
        "Attack of the Clones": "ataque dos clones",
        "Revenge of the Sith": "a vinganca dos sith"
    };

    return traducao[characterName];
}