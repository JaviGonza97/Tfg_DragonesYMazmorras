document.addEventListener("DOMContentLoaded", () => {
    // Obtener elementos del DOM
    const characterSelector = document.getElementById("characterSelector")
    const characterTitle = document.getElementById("characterTitle")
    const characterName = document.getElementById("characterName")
    const characterClass = document.getElementById("characterClass")
    const diceButtons = document.querySelectorAll(".btn-dice")
    const rollBtn = document.getElementById("dashboardRollBtn")
    const quantityInput = document.getElementById("dashboardQuantity")
    const modifierInput = document.getElementById("dashboardModifier")
    const resultElement = document.getElementById("dashboardResult")

    let selectedDice = 20 // Valor por defecto: d20

    // Evento para selector de personaje
    if (characterSelector) {
        characterSelector.addEventListener("change", function () {
            const selectedCharacter = this.value

            // Actualizar nombre del personaje
            if (characterTitle) characterTitle.textContent = selectedCharacter.toUpperCase()
            if (characterName) characterName.textContent = selectedCharacter.toUpperCase()

            // para cargar los datos de los pe4rsonajes desde el back
            // por ahora hare una simluacion para prueba, hay que cambiar
            if (selectedCharacter === "Goram") {
                characterClass.textContent = "Bárbaro · Nivel 1"
            } else if (selectedCharacter === "Thordak") {
                characterClass.textContent = "Guerrero · Nivel 2"
            } else if (selectedCharacter === "Elindra") {
                characterClass.textContent = "Maga · Nivel 1"
            }
        })
    }

    // Evento para botones de dados
    diceButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            diceButtons.forEach((b) => b.classList.remove("active"))

            this.classList.add("active")

            selectedDice = Number.parseInt(this.getAttribute("data-dice"))
        })
    })

    // Evento para botón de lanzar dados
    if (rollBtn) {
        rollBtn.addEventListener("click", () => {
            const quantity = Number.parseInt(quantityInput.value) || 1
            const modifier = Number.parseInt(modifierInput.value) || 0

            // Validar cantidad
            if (quantity < 1 || quantity > 10) {
                alert("La cantidad debe estar entre 1 y 10")
                return
            }

            // Lanzar dados
            let sum = 0
            const results = []

            for (let i = 0; i < quantity; i++) {
                const result = Math.floor(Math.random() * selectedDice) + 1
                results.push(result)
                sum += result
            }

            // Mostrar resultado total
            const total = sum + modifier
            resultElement.textContent = total
        })
    }
})

