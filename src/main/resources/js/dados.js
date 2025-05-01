document.addEventListener("DOMContentLoaded", () => {
    let selectedDice = 20 // Valor por defecto: d20
    const diceButtons = document.querySelectorAll(".btn-dice")
    const rollBtn = document.getElementById("rollBtn")
    const quantityInput = document.getElementById("quantity")
    const modifierInput = document.getElementById("modifier")
    const resultsContainer = document.getElementById("resultsContainer")
    const diceResults = document.getElementById("diceResults")
    const totalResult = document.getElementById("totalResult").querySelector("span")
    const resultBreakdown = document.getElementById("resultBreakdown")

    // Evento para botones de dados aun da fallos, buscar solucion
    diceButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            // Quitar clase active de todos los botones
            diceButtons.forEach((b) => b.classList.remove("active"))

            // Añadir clase active al botón seleccionado
            this.classList.add("active")

            // Actualizar dado seleccionado
            selectedDice = Number.parseInt(this.getAttribute("data-dice"))
        })
    })

    // con esto tenemos el evento para lanzamiento de los dados
    rollBtn.addEventListener("click", () => {
        const quantity = Number.parseInt(quantityInput.value) || 1
        const modifier = Number.parseInt(modifierInput.value) || 0

        if (quantity < 1 || quantity > 10) {
            alert("La cantidad debe estar entre 1 y 10")
            return
        }

        // lanzar dados
        const results = []
        let sum = 0

        for (let i = 0; i < quantity; i++) {
            const result = Math.floor(Math.random() * selectedDice) + 1
            results.push(result)
            sum += result
        }

        // mostra resultados
        diceResults.innerHTML = ""
        results.forEach((result) => {
            const diceElement = document.createElement("div")
            diceElement.className = "dice-result"
            diceElement.textContent = result
            diceResults.appendChild(diceElement)
        })

        // Si hay modificador, añadirlo
        if (modifier !== 0) {
            const modifierElement = document.createElement("div")
            modifierElement.className = "dice-result bg-light"
            modifierElement.textContent = modifier > 0 ? `+${modifier}` : modifier

            const plusElement = document.createElement("div")
            plusElement.className = "mx-2 d-flex align-items-center"
            plusElement.textContent = "+"

            diceResults.appendChild(plusElement)
            diceResults.appendChild(modifierElement)
        }

        // Mostrar resultado total
        const total = sum + modifier
        totalResult.textContent = total
        if (quantity > 1) {
            resultBreakdown.textContent = `${results.join(" + ")}${modifier !== 0 ? ` + (${modifier})` : ""} = ${total}`
        } else {
            resultBreakdown.textContent = ""
        }

        // ccontenedor de resultados
        resultsContainer.classList.remove("d-none")
    })
})

