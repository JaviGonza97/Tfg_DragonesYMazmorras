import { apiRequest } from "./api.js";
import { requireAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  // ----------- CARGA DE PERSONAJES -----------
  let personajes = [];
  const personajeSelect = document.getElementById("personaje-select");

  try {
    personajes = await apiRequest("/api/personajes/mios", "GET", null, true);
    cargarSelectorPersonajes(personajes);
  } catch (err) {
    console.error("Error al cargar personajes", err);
  }

  function cargarSelectorPersonajes(lista) {
    lista.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      personajeSelect.appendChild(option);
    });

    if (lista.length > 0) {
      personajeSelect.value = lista[0].id;
      mostrarPersonaje(lista[0]);
    }
  }

  personajeSelect.addEventListener("change", () => {
    const p = personajes.find(c => c.id == personajeSelect.value);
    mostrarPersonaje(p);
  });

  function mostrarPersonaje(p) {
    const imgName = `${p.raza.toLowerCase()}_${p.clase.toLowerCase()}.png`;
    document.getElementById("personaje-avatar").src = `img/${imgName}`;
    document.getElementById("personaje-nombre").textContent = p.nombre;
    document.getElementById("personaje-raza-clase").textContent = `${p.raza} - ${p.clase}`;
    document.getElementById("stat-fuerza").textContent = p.fuerza;
    document.getElementById("stat-destreza").textContent = p.destreza;
    document.getElementById("stat-resistencia").textContent = p.resistencia;
    document.getElementById("stat-magia").textContent = p.magia;
  }

  // ----------- PARTE DE DADOS (tu código original simplificado) -----------
  const numDados = document.getElementById("num-dados");
  const dadoSelect = document.getElementById("dado-select");
  const modificador = document.getElementById("modificador");
  const lanzarBtn = document.getElementById("lanzar-btn");
  const resultadoDado = document.getElementById("resultado-dado");
  const detallesTirada = document.getElementById("detalles-tirada");
  const historialContainer = document.getElementById("historial-container");
  const historialTiradas = document.getElementById("historial-tiradas");
  const clearHistoryBtn = document.getElementById("clear-history");

  let historial = JSON.parse(localStorage.getItem("diceHistory")) || [];
  renderHistorial();

  lanzarBtn.addEventListener("click", () => {
    const cantidad = parseInt(numDados.value);
    const caras = parseInt(dadoSelect.value);
    const mod = parseInt(modificador.value);

    if (cantidad < 1 || cantidad > 20) {
      alert("Cantidad inválida (1 a 20).");
      return;
    }

    const tiradas = Array.from({ length: cantidad }, () => Math.floor(Math.random() * caras) + 1);
    const suma = tiradas.reduce((a, b) => a + b, 0);
    const total = suma + mod;

    resultadoDado.textContent = total;

    let detalles = `[${tiradas.join(" + ")}]`;
    if (mod !== 0) {
      detalles += ` ${mod >= 0 ? "+" : ""}${mod}`;
    }
    detalles += ` = ${total}`;
    detallesTirada.textContent = detalles;

    const tiradaHist = {
      tipo: `${cantidad}D${caras}${mod >= 0 ? "+" : ""}${mod}`,
      tiradas,
      total,
      fecha: new Date().toLocaleString()
    };

    historial.unshift(tiradaHist);
    historial = historial.slice(0, 10);
    localStorage.setItem("diceHistory", JSON.stringify(historial));
    renderHistorial();
  });

  clearHistoryBtn.addEventListener("click", () => {
    historial = [];
    localStorage.removeItem("diceHistory");
    renderHistorial();
  });

  function renderHistorial() {
    historialTiradas.innerHTML = "";
    if (historial.length === 0) {
      historialContainer.classList.add("d-none");
      return;
    }
    historialContainer.classList.remove("d-none");
    historial.forEach(tirada => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${tirada.tipo}: ${tirada.total} (${tirada.fecha})`;
      historialTiradas.appendChild(li);
    });
  }
});
