let currentPageUrl = 'https://swapi.dev/api/vehicles/'

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

      responseJson.results.forEach(async (vehicles) => {
        const card = document.createElement("div")
        let urlImg = `https://starwars-visualguide.com/assets/img/vehicles/${vehicles.url.replace(/\D/g, "")}.jpg`;
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
        characterName.innerText = `${vehicles.name}`

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
            name.innerText = `Nome: ${vehicles.name}`
           
            const vehiclesModel = document.createElement("span")
            vehiclesModel.className = "character-details"
            vehiclesModel.innerText = `modelo: ${vehicles.model}`

            const manufacturer = document.createElement("span")
            manufacturer.className = "character-details"
            manufacturer.innerText = `Fabricante: ${vehicles.manufacturer}`

            const cargoCapacity = document.createElement("span")
            cargoCapacity.className = "character-details"
            cargoCapacity.innerText = `Capacidade de Carga: ${convertCargoCapacity(vehicles.cargo_capacity)}`

            const vehiclesLength = document.createElement("span")
            vehiclesLength.className = "character-details"
            vehiclesLength.innerText = `Comprimento: ${convertVehiclesLength(vehicles.length)}`

            modalContent.appendChild(characterImage)
            modalContent.appendChild(name)
            modalContent.appendChild(vehiclesModel)
            modalContent.appendChild(manufacturer)
            modalContent.appendChild(cargoCapacity)
            modalContent.appendChild(vehiclesLength)
            
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

function convertCargoCapacity(cargoCapacity){
    if(cargoCapacity === "unknown") {
        return "Desconhecido"
    }
   
    return `${cargoCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} t`
    
}

function convertVehiclesLength(vehiclesLength) {
   
    return `${vehiclesLength.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} m`
}