document.addEventListener("DOMContentLoaded", () => {
  // Estado del personaje
  let characterData = {
    name: "",
    level: 1,
    race: "",
    class: "",
    stats: {
      fuerza: 8,
      destreza: 8,
      defensa: 8,
      magia: 8,
    },
    baseStats: {
      fuerza: 8,
      destreza: 8,
      defensa: 8,
      magia: 8,
    },
  }

  let pointsRemaining = 27
  const maxStatValue = 15
  const minStatValue = 8

  // Bonificaciones por raza
  const raceBonuses = {
    humano: { fuerza: 2, destreza: 3, defensa: 2, magia: -3 },
    orco: { fuerza: 3, destreza: -1, defensa: 3, magia: 0 },
    enano: { fuerza: 1, destreza: -3, defensa: 5, magia: 1 },
    elfo: { fuerza: -2, destreza: 2, defensa: 0, magia: 4 },
    dragon: { fuerza: 3, destreza: -2, defensa: 0, magia: 4 },
  }

  // Bonificaciones por clase
  const classBonuses = {
    guerrero: { fuerza: 4, destreza: 3, defensa: 1, magia: -4 },
    paladin: { fuerza: 2, destreza: -5, defensa: 6, magia: 2 },
    hechicero: { fuerza: -2, destreza: -2, defensa: 2, magia: 6 },
  }

  // Restricciones de raza-clase
  const classRestrictions = {
    orco: ["paladin"], // Orcos no pueden ser paladines
    elfo: ["guerrero"], // Elfos no pueden ser guerreros
  }

  // Descripciones de razas
  const raceDescriptions = {
    humano:
      "Los humanos son la raza más versátil y adaptable. Su determinación y ambición los lleva a destacar en cualquier campo que elijan.",
    orco: "Los orcos son guerreros feroces con una fuerza física incomparable. Su cultura valora el honor en el combate y la lealtad al clan.",
    enano:
      "Los enanos son conocidos por su resistencia y habilidad en la forja. Viven en montañas y son maestros de la artesanía y la defensa.",
    elfo: "Los elfos son seres gráciles y longevos, profundamente conectados con la magia y la naturaleza. Su agilidad es legendaria.",
    dragon:
      "Los dragones son seres ancestrales de inmenso poder mágico. Su presencia es imponente y su sabiduría, milenaria.",
  }

  // Descripciones de clases
  const classDescriptions = {
    guerrero:
      "Los guerreros son maestros del combate cuerpo a cuerpo, expertos en el uso de armas y tácticas de batalla.",
    paladin:
      "Los paladines combinan la fuerza del guerrero con el poder divino, sirviendo como protectores de los inocentes.",
    hechicero: "Los hechiceros poseen poder mágico innato, capaces de manipular las fuerzas arcanas con su voluntad.",
  }

  // Referencias a elementos del DOM
  const characterNameInput = document.getElementById("character-name")
  const characterLevelSelect = document.getElementById("character-level")
  const raceCards = document.querySelectorAll(".race-card")
  const classCards = document.querySelectorAll(".class-card")
  const pointsRemainingSpan = document.getElementById("points-remaining")

  // Inicializar la aplicación
  init()

  function init() {
    setupEventListeners()
    updatePreview()
    updateStatBars()
  }

  function setupEventListeners() {
    // Nombre del personaje
    characterNameInput.addEventListener("input", (e) => {
      characterData.name = e.target.value
      updatePreview()
    })

    // Nivel del personaje
    characterLevelSelect.addEventListener("change", (e) => {
      characterData.level = Number.parseInt(e.target.value)
      updatePreview()
    })

    // Selección de raza
    raceCards.forEach((card) => {
      card.addEventListener("click", () => {
        selectRace(card.dataset.race)
      })
    })

    // Selección de clase
    classCards.forEach((card) => {
      card.addEventListener("click", () => {
        selectClass(card.dataset.class)
      })
    })

    // Botones de estadísticas
    setupStatButtons()

    // Botones de acción
    document.getElementById("reset-stats").addEventListener("click", resetStats)
    document.getElementById("random-stats").addEventListener("click", randomizeStats)
    document.getElementById("preview-character").addEventListener("click", showPreviewModal)
    document.getElementById("save-draft").addEventListener("click", saveDraft)
    document.getElementById("create-character").addEventListener("click", createCharacter)
    document.getElementById("confirm-create").addEventListener("click", confirmCreateCharacter)
  }

  function setupStatButtons() {
    const stats = ["fuerza", "destreza", "defensa", "magia"]

    stats.forEach((stat) => {
      const decreaseBtn = document.getElementById(`decrease-${stat}`)
      const increaseBtn = document.getElementById(`increase-${stat}`)

      decreaseBtn.addEventListener("click", () => {
        decreaseStat(stat)
      })

      increaseBtn.addEventListener("click", () => {
        increaseStat(stat)
      })
    })
  }

  function selectRace(race) {
    // Remover selección anterior
    raceCards.forEach((card) => card.classList.remove("selected"))

    // Seleccionar nueva raza
    const selectedCard = document.querySelector(`[data-race="${race}"]`)
    selectedCard.classList.add("selected")

    // Guardar la raza seleccionada
    characterData.race = race

    // Si la clase actual está restringida para esta raza, deseleccionarla
    if (characterData.class && isClassRestrictedForRace(characterData.class, race)) {
      characterData.class = ""
      classCards.forEach((card) => card.classList.remove("selected"))
      showNotification(`Los ${race}s no pueden ser ${capitalizeFirst(characterData.class)}es`, "warning")
    }

    // Actualizar la interfaz para mostrar/ocultar clases restringidas
    updateClassRestrictions(race)

    updateCharacterAvatar()
    updatePreview()
    updateRaceBonusesText()
  }

  function selectClass(characterClass) {
    // Verificar si la clase está restringida para la raza actual
    if (characterData.race && isClassRestrictedForRace(characterClass, characterData.race)) {
      showNotification(`Los ${characterData.race}s no pueden ser ${capitalizeFirst(characterClass)}es`, "warning")
      return
    }

    // Remover selección anterior
    classCards.forEach((card) => card.classList.remove("selected"))

    // Seleccionar nueva clase
    const selectedCard = document.querySelector(`[data-class="${characterClass}"]`)
    selectedCard.classList.add("selected")

    characterData.class = characterClass
    updateCharacterAvatar()
    updatePreview()
    updateClassBonusesText()
  }

  function isClassRestrictedForRace(characterClass, race) {
    return classRestrictions[race] && classRestrictions[race].includes(characterClass)
  }

  function updateClassRestrictions(race) {
    // Resetear todas las clases primero
    classCards.forEach((card) => {
      card.classList.remove("disabled")
      card.style.opacity = "1"
      card.style.cursor = "pointer"
    })

    // Si hay restricciones para esta raza, aplicarlas
    if (classRestrictions[race]) {
      classRestrictions[race].forEach((restrictedClass) => {
        const restrictedCard = document.querySelector(`[data-class="${restrictedClass}"]`)
        if (restrictedCard) {
          restrictedCard.classList.add("disabled")
          restrictedCard.style.opacity = "0.5"
          restrictedCard.style.cursor = "not-allowed"

          // Añadir mensaje de restricción
          const bonusesElement = restrictedCard.querySelector(".class-bonuses small")
          if (bonusesElement) {
            const originalText = bonusesElement.getAttribute("data-original-text") || bonusesElement.textContent
            if (!bonusesElement.getAttribute("data-original-text")) {
              bonusesElement.setAttribute("data-original-text", originalText)
            }
            bonusesElement.textContent = `No disponible para ${race}s`
            bonusesElement.style.color = "#dc3545"
          }
        }
      })
    } else {
      // Restaurar textos originales si no hay restricciones
      classCards.forEach((card) => {
        const bonusesElement = card.querySelector(".class-bonuses small")
        if (bonusesElement && bonusesElement.getAttribute("data-original-text")) {
          bonusesElement.textContent = bonusesElement.getAttribute("data-original-text")
          bonusesElement.style.color = ""
        }
      })
    }
  }

  function increaseStat(stat) {
    if (characterData.baseStats[stat] < maxStatValue && pointsRemaining > 0) {
      const cost = getStatCost(characterData.baseStats[stat])
      if (pointsRemaining >= cost) {
        characterData.baseStats[stat]++
        pointsRemaining -= cost
        updateStatDisplay()
        updatePreview()
      }
    }
  }

  function decreaseStat(stat) {
    if (characterData.baseStats[stat] > minStatValue) {
      characterData.baseStats[stat]--
      const refund = getStatCost(characterData.baseStats[stat])
      pointsRemaining += refund
      updateStatDisplay()
      updatePreview()
    }
  }

  function getStatCost(currentValue) {
    if (currentValue >= 13) return 2
    return 1
  }

  function resetStats() {
    characterData.baseStats = {
      fuerza: 8,
      destreza: 8,
      defensa: 8,
      magia: 8,
    }
    pointsRemaining = 27
    updateStatDisplay()
    updatePreview()
  }

  function randomizeStats() {
    resetStats()

    const stats = ["fuerza", "destreza", "defensa", "magia"]

    while (pointsRemaining > 0) {
      const randomStat = stats[Math.floor(Math.random() * stats.length)]
      if (characterData.baseStats[randomStat] < maxStatValue) {
        const cost = getStatCost(characterData.baseStats[randomStat])
        if (pointsRemaining >= cost) {
          characterData.baseStats[randomStat]++
          pointsRemaining -= cost
        }
      }
    }

    updateStatDisplay()
    updatePreview()
  }

  function updateStatDisplay() {
    const stats = ["fuerza", "destreza", "defensa", "magia"]

    stats.forEach((stat) => {
      const baseValue = characterData.baseStats[stat]
      const finalValue = getFinalStatValue(stat)

      // Actualizar valores mostrados
      document.getElementById(`${stat}-value`).textContent = baseValue
      document.getElementById(`${stat}-display`).textContent = finalValue

      // Actualizar barras de progreso
      const percentage = ((finalValue - 8) / (20 - 8)) * 100
      document.getElementById(`${stat}-bar`).style.width = `${Math.max(percentage, 5)}%`

      // Actualizar botones
      const decreaseBtn = document.getElementById(`decrease-${stat}`)
      const increaseBtn = document.getElementById(`increase-${stat}`)

      decreaseBtn.disabled = baseValue <= minStatValue
      increaseBtn.disabled = baseValue >= maxStatValue || pointsRemaining < getStatCost(baseValue)
    })

    pointsRemainingSpan.textContent = pointsRemaining
  }

  function getFinalStatValue(stat) {
    let value = characterData.baseStats[stat]

    // Aplicar bonificaciones de raza
    if (characterData.race && raceBonuses[characterData.race]) {
      value += raceBonuses[characterData.race][stat] || 0
    }

    // Aplicar bonificaciones de clase
    if (characterData.class && classBonuses[characterData.class]) {
      value += classBonuses[characterData.class][stat] || 0
    }

    return value
  }

  function updateCharacterAvatar() {
    const avatar = document.getElementById("character-avatar")
    const avatarIcon = avatar.querySelector("i")

    // Cambiar icono según la raza
    const raceIcons = {
      humano: "bi-person",
      orco: "bi-shield-shaded",
      enano: "bi-hammer",
      elfo: "bi-tree",
      dragon: "bi-fire",
    }

    if (characterData.race && raceIcons[characterData.race]) {
      avatarIcon.className = `bi ${raceIcons[characterData.race]}`
    }
  }

  function updatePreview() {
    // Actualizar nombre
    const previewName = document.getElementById("preview-name")
    previewName.textContent = characterData.name || "Nombre del personaje"

    // Actualizar raza y clase
    const previewRaceClass = document.getElementById("preview-race-class")
    if (characterData.race && characterData.class) {
      previewRaceClass.textContent = `${capitalizeFirst(characterData.race)} - ${capitalizeFirst(characterData.class)}`
    } else if (characterData.race) {
      previewRaceClass.textContent = capitalizeFirst(characterData.race)
    } else if (characterData.class) {
      previewRaceClass.textContent = capitalizeFirst(characterData.class)
    } else {
      previewRaceClass.textContent = "Selecciona raza y clase"
    }

    // Actualizar nivel
    document.getElementById("preview-level").textContent = `Nivel ${characterData.level}`

    // Actualizar estadísticas
    const stats = ["fuerza", "destreza", "defensa", "magia"]
    stats.forEach((stat) => {
      const finalValue = getFinalStatValue(stat)
      document.getElementById(`preview-${stat}`).textContent = finalValue
    })
  }

  function updateRaceBonusesText() {
    const raceBonusesText = document.getElementById("race-bonuses-text")
    if (characterData.race && raceBonuses[characterData.race]) {
      const bonuses = raceBonuses[characterData.race]
      const bonusTexts = []

      Object.keys(bonuses).forEach((stat) => {
        const value = bonuses[stat]
        if (value !== 0) {
          const sign = value > 0 ? "+" : ""
          bonusTexts.push(`${sign}${value} ${capitalizeFirst(stat)}`)
        }
      })

      raceBonusesText.textContent = bonusTexts.length > 0 ? bonusTexts.join(", ") : "Sin bonificaciones"
    } else {
      raceBonusesText.textContent = "Selecciona una raza para ver las bonificaciones"
    }
  }

  function updateClassBonusesText() {
    const classBonusesText = document.getElementById("class-bonuses-text")
    if (characterData.class && classBonuses[characterData.class]) {
      const bonuses = classBonuses[characterData.class]
      const bonusTexts = []

      Object.keys(bonuses).forEach((stat) => {
        const value = bonuses[stat]
        if (value !== 0) {
          const sign = value > 0 ? "+" : ""
          bonusTexts.push(`${sign}${value} ${capitalizeFirst(stat)}`)
        }
      })

      classBonusesText.textContent = bonusTexts.length > 0 ? bonusTexts.join(", ") : "Sin bonificaciones"
    } else {
      classBonusesText.textContent = "Selecciona una clase para ver las bonificaciones"
    }
  }

  function updateStatBars() {
    updateStatDisplay()
  }

  function showPreviewModal() {
    if (!validateCharacter()) {
      return
    }

    // Actualizar contenido del modal
    document.getElementById("modal-preview-name").textContent = characterData.name
    document.getElementById("modal-preview-race-class").textContent =
      `${capitalizeFirst(characterData.race)} - ${capitalizeFirst(characterData.class)}`
    document.getElementById("modal-preview-level").textContent = `Nivel ${characterData.level}`

    // Actualizar estadísticas del modal
    const stats = ["fuerza", "destreza", "defensa", "magia"]
    stats.forEach((stat) => {
      const finalValue = getFinalStatValue(stat)
      document.getElementById(`modal-preview-${stat}`).textContent = finalValue
    })

    // Generar descripción del personaje
    generateCharacterDescription()

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("previewModal"))
    modal.show()
  }

  function generateCharacterDescription() {
    const descriptionElement = document.getElementById("character-description")

    let description = `${characterData.name} es un${characterData.race === "elfo" ? " elfo" : characterData.race === "orco" ? " orco" : characterData.race === "enano" ? " enano" : characterData.race === "dragon" ? " dragón" : " humano"} ${characterData.class} de nivel ${characterData.level}. `

    if (raceDescriptions[characterData.race]) {
      description += raceDescriptions[characterData.race] + " "
    }

    if (classDescriptions[characterData.class]) {
      description += classDescriptions[characterData.class]
    }

    descriptionElement.textContent = description
  }

  function validateCharacter() {
    const errors = []

    if (!characterData.name.trim()) {
      errors.push("Debes introducir un nombre para tu personaje.")
    }

    if (!characterData.race) {
      errors.push("Debes seleccionar una raza.")
    }

    if (!characterData.class) {
      errors.push("Debes seleccionar una clase.")
    }

    // Verificar restricciones de raza-clase
    if (characterData.race && characterData.class) {
      if (isClassRestrictedForRace(characterData.class, characterData.race)) {
        errors.push(`Los ${characterData.race}s no pueden ser ${characterData.class}es.`)
      }
    }

    if (pointsRemaining > 0) {
      errors.push(`Te quedan ${pointsRemaining} puntos de estadística por asignar.`)
    }

    if (errors.length > 0) {
      alert("Por favor, completa los siguientes campos:\n\n" + errors.join("\n"))
      return false
    }

    return true
  }

  function saveDraft() {
    if (!characterData.name.trim()) {
      alert("Debes introducir un nombre para guardar el borrador.")
      return
    }

    // Guardar en localStorage
    const draftData = {
      ...characterData,
      finalStats: {
        fuerza: getFinalStatValue("fuerza"),
        destreza: getFinalStatValue("destreza"),
        defensa: getFinalStatValue("defensa"),
        magia: getFinalStatValue("magia"),
      },
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("characterDraft", JSON.stringify(draftData))

    // Mostrar confirmación
    showNotification("Borrador guardado correctamente", "success")
  }

  function createCharacter() {
    if (!validateCharacter()) {
      return
    }

    showPreviewModal()
  }

  function confirmCreateCharacter() {
    // Verificar si el usuario está autenticado
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    if (!currentUser) {
      alert("Debes iniciar sesión para crear un personaje.")
      window.location.href = "login.html"
      return
    }

    // Crear objeto del personaje
    const newCharacter = {
      id: Date.now().toString(),
      name: characterData.name,
      level: characterData.level,
      race: characterData.race,
      class: characterData.class,
      stats: {
        fuerza: getFinalStatValue("fuerza"),
        destreza: getFinalStatValue("destreza"),
        defensa: getFinalStatValue("defensa"),
        magia: getFinalStatValue("magia"),
      },
      baseStats: { ...characterData.baseStats },
      createdAt: new Date().toISOString(),
    }

    // Aquí se enviaría al backend
    // Por ahora, guardamos en localStorage
    saveCharacterToLocalStorage(newCharacter)

    // Cerrar modal
    const modalElement = document.getElementById("previewModal")
    const modal = bootstrap.Modal.getInstance(modalElement)
    if (modal) {
      modal.hide()
    } else {
      // Fallback si no se puede obtener la instancia
      $(modalElement).modal("hide")
    }

    // Mostrar confirmación y redirigir
    showNotification("¡Personaje creado exitosamente!", "success")

    setTimeout(() => {
      window.location.href = "Galeria.html"
    }, 2000)
  }

  function saveCharacterToLocalStorage(character) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const users = JSON.parse(localStorage.getItem("users")) || []

    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      if (!users[userIndex].characters) {
        users[userIndex].characters = []
      }

      users[userIndex].characters.push(character)

      // Actualizar estadísticas del usuario
      if (!users[userIndex].stats) {
        users[userIndex].stats = { characterCount: 0, campaignCount: 0, rollCount: 0 }
      }
      users[userIndex].stats.characterCount = users[userIndex].characters.length

      // Añadir actividad
      if (!users[userIndex].activities) {
        users[userIndex].activities = []
      }
      users[userIndex].activities.unshift({
        type: "character_created",
        date: new Date().toISOString(),
        details: {
          characterName: character.name,
          race: character.race,
          class: character.class,
        },
      })

      // Limitar actividades a 10
      if (users[userIndex].activities.length > 10) {
        users[userIndex].activities = users[userIndex].activities.slice(0, 10)
      }

      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `alert alert-${type} position-fixed`
    notification.style.cssText = "top: 20px; right: 20px; z-index: 1050; min-width: 300px;"
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("fade")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 150)
    }, 3000)
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Cargar borrador si existe
  function loadDraft() {
    const draft = localStorage.getItem("characterDraft")
    if (draft) {
      const draftData = JSON.parse(draft)

      // Preguntar si quiere cargar el borrador
      if (confirm("Se encontró un borrador guardado. ¿Quieres cargarlo?")) {
        characterData = { ...draftData }

        // Actualizar interfaz
        characterNameInput.value = characterData.name
        characterLevelSelect.value = characterData.level

        if (characterData.race) {
          selectRace(characterData.race)
        }

        if (characterData.class) {
          selectClass(characterData.class)
        }

        // Calcular puntos restantes
        let usedPoints = 0
        Object.values(characterData.baseStats).forEach((value) => {
          for (let i = 8; i < value; i++) {
            usedPoints += getStatCost(i)
          }
        })
        pointsRemaining = 27 - usedPoints

        updateStatDisplay()
        updatePreview()
      }
    }
  }

  // Cargar borrador al inicializar
  setTimeout(loadDraft, 500)
})
