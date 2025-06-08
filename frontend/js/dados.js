import { apiRequest } from "./api.js"
import { requireAuth } from "./auth.js"

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth()

  // ----------- CARGA DE PERSONAJES -----------
  let personajes = []
  const personajeSelect = document.getElementById("personaje-select")

  try {
    personajes = await apiRequest("/api/personajes/mios", "GET", null, true)
    cargarSelectorPersonajes(personajes)
  } catch (err) {
    console.error("Error al cargar personajes", err)
  }

  function cargarSelectorPersonajes(lista) {
    lista.forEach((p) => {
      const option = document.createElement("option")
      option.value = p.id
      option.textContent = p.nombre
      personajeSelect.appendChild(option)
    })

    if (lista.length > 0) {
      personajeSelect.value = lista[0].id
      mostrarPersonaje(lista[0])
    }
  }

  personajeSelect.addEventListener("change", () => {
    const p = personajes.find((c) => c.id == personajeSelect.value)
    mostrarPersonaje(p)
  })

  function mostrarPersonaje(p) {
    const imgName = `${p.raza.toLowerCase()}_${p.clase.toLowerCase()}.png`
    document.getElementById("personaje-avatar").src = `img/${imgName}`
    document.getElementById("personaje-nombre").textContent = p.nombre
    document.getElementById("personaje-raza-clase").textContent = `${p.raza} - ${p.clase}`
    document.getElementById("stat-fuerza").textContent = p.fuerza
    document.getElementById("stat-destreza").textContent = p.destreza
    document.getElementById("stat-resistencia").textContent = p.resistencia
    document.getElementById("stat-magia").textContent = p.magia
  }

  // ----------- PARTE DE DADOS CON ANIMACIÓN -----------
  const numDados = document.getElementById("num-dados")
  const dadoSelect = document.getElementById("dado-select")
  const modificador = document.getElementById("modificador")
  const lanzarBtn = document.getElementById("lanzar-btn")
  const resultadoDado = document.getElementById("resultado-dado")
  const detallesTirada = document.getElementById("detalles-tirada")
  const historialContainer = document.getElementById("historial-container")
  const historialTiradas = document.getElementById("historial-tiradas")
  const clearHistoryBtn = document.getElementById("clear-history")
  const diceAnimationContainer = document.getElementById("dice-animation-container")

  let historial = JSON.parse(localStorage.getItem("diceHistory")) || []
  let isRolling = false
  renderHistorial()

  // Función para obtener el icono del dado según el tipo
  function getDiceIcon(caras) {
    const iconos = {
      4: "bi-dice-4",
      6: "bi-dice-6",
      8: "bi-dice-6",
      10: "bi-dice-6",
      12: "bi-dice-6",
      20: "bi-dice-6",
      100: "bi-dice-6",
    }
    return iconos[caras] || "bi-dice-6"
  }

  // Función para crear la animación de dados
  function createDiceAnimation(cantidad, caras) {
    diceAnimationContainer.innerHTML = ""

    // Crear dados animados
    for (let i = 0; i < Math.min(cantidad, 5); i++) {
      // Máximo 5 dados visibles
      const diceIcon = document.createElement("i")
      diceIcon.className = `bi ${getDiceIcon(caras)} dice-rolling`
      diceAnimationContainer.appendChild(diceIcon)
    }

    // Si hay más de 5 dados, mostrar texto adicional
    if (cantidad > 5) {
      const extraText = document.createElement("span")
      extraText.className = "rolling-text ms-3"
      extraText.textContent = `+${cantidad - 5} más`
      diceAnimationContainer.appendChild(extraText)
    }
  }

  // Función para animar el resultado final
  function animateResult(elemento) {
    elemento.classList.remove("result-appear")
    // Forzar reflow
    elemento.offsetHeight
    elemento.classList.add("result-appear")
  }

  // Función para simular números cambiantes durante la animación
  function animateNumbers(finalResult, duration = 1500) {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress >= 1) {
        clearInterval(interval)
        resultadoDado.textContent = finalResult
        animateResult(resultadoDado)
        return
      }

      // Generar número aleatorio para simular el cambio
      const randomNum = Math.floor(Math.random() * finalResult * 2) + 1
      resultadoDado.textContent = randomNum
    }, 100)
  }

  lanzarBtn.addEventListener("click", async () => {
    if (isRolling) return

    const cantidad = Number.parseInt(numDados.value)
    const caras = Number.parseInt(dadoSelect.value)
    const mod = Number.parseInt(modificador.value)

    if (cantidad < 1 || cantidad > 20) {
      alert("Cantidad inválida (1 a 20).")
      return
    }

    // Iniciar animación
    isRolling = true
    lanzarBtn.classList.add("rolling")
    lanzarBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Lanzando...'

    // Mostrar contenedor de animación
    diceAnimationContainer.style.display = "flex"
    createDiceAnimation(cantidad, caras)

    // Ocultar resultado anterior
    resultadoDado.textContent = "🎲"
    detallesTirada.textContent = "Calculando..."

    // Calcular resultado real
    const tiradas = Array.from({ length: cantidad }, () => Math.floor(Math.random() * caras) + 1)
    const suma = tiradas.reduce((a, b) => a + b, 0)
    const total = suma + mod

    // Animar números cambiantes
    animateNumbers(total, 1500)

    // Esperar a que termine la animación
    await new Promise((resolve) => setTimeout(resolve, 1800))

    // Mostrar detalles
    let detalles = `[${tiradas.join(" + ")}]`
    if (mod !== 0) {
      detalles += ` ${mod >= 0 ? "+" : ""}${mod}`
    }
    detalles += ` = ${total}`
    detallesTirada.textContent = detalles
    animateResult(detallesTirada)

    // Ocultar animación
    diceAnimationContainer.style.display = "none"

    // Agregar al historial
    const tiradaHist = {
      tipo: `${cantidad}D${caras}${mod >= 0 ? "+" : ""}${mod}`,
      tiradas,
      total,
      fecha: new Date().toLocaleString(),
    }

    historial.unshift(tiradaHist)
    historial = historial.slice(0, 10)
    localStorage.setItem("diceHistory", JSON.stringify(historial))
    renderHistorial()

    // Restaurar botón
    isRolling = false
    lanzarBtn.classList.remove("rolling")
    lanzarBtn.innerHTML = '<i class="bi bi-dice-3 me-2"></i>Lanzar dados'
  })

  clearHistoryBtn.addEventListener("click", () => {
    historial = []
    localStorage.removeItem("diceHistory")
    renderHistorial()
  })

  function renderHistorial() {
    historialTiradas.innerHTML = ""
    if (historial.length === 0) {
      historialContainer.classList.add("d-none")
      return
    }
    historialContainer.classList.remove("d-none")
    historial.forEach((tirada) => {
      const li = document.createElement("li")
      li.className = "list-group-item"
      li.textContent = `${tirada.tipo}: ${tirada.total} (${tirada.fecha})`
      historialTiradas.appendChild(li)
    })
  }
})
