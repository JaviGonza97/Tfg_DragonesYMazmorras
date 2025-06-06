import { apiRequest } from "./api.js";
import { requireAuth, getUserInfo } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  const user = getUserInfo();
  if (!user) {
    alert("No se pudo obtener la información del usuario.");
    return;
  }

  const formBtn = document.getElementById("create-character");
  const nameInput = document.getElementById("character-name");
  const namePreview = document.getElementById("preview-name");

  nameInput.addEventListener("input", () => {
    namePreview.textContent = nameInput.value || "Nombre del personaje";
  });

  const razaBonos = {
    humano: { fuerza: 2, destreza: 3, defensa: 2, magia: -3 },
    orco: { fuerza: 3, destreza: -1, defensa: 3, magia: 0 },
    enano: { fuerza: 1, destreza: -3, defensa: 5, magia: 1 },
    elfo: { fuerza: -2, destreza: 2, defensa: 0, magia: 4 },
    dragon: { fuerza: 3, destreza: -2, defensa: 0, magia: 4 },
  };

  const claseBonos = {
    guerrero: { fuerza: 4, destreza: 3, defensa: 1, magia: -4 },
    paladin: { fuerza: 2, destreza: -5, defensa: 6, magia: 2 },
    hechicero: { fuerza: -2, destreza: -2, defensa: 2, magia: 6 },
  };

  let selectedRaza = null;
  let selectedClase = null;

  function actualizarStats() {
    const base = { fuerza: 0, destreza: 0, defensa: 0, magia: 0 };
    const raza = razaBonos[selectedRaza?.nombre] || {};
    const clase = claseBonos[selectedClase?.nombre] || {};

    const total = {
      fuerza: base.fuerza + (raza.fuerza || 0) + (clase.fuerza || 0),
      destreza: base.destreza + (raza.destreza || 0) + (clase.destreza || 0),
      defensa: base.defensa + (raza.defensa || 0) + (clase.defensa || 0),
      magia: base.magia + (raza.magia || 0) + (clase.magia || 0),
    };

    document.getElementById("preview-fuerza").textContent = total.fuerza;
    document.getElementById("preview-destreza").textContent = total.destreza;
    document.getElementById("preview-defensa").textContent = total.defensa;
    document.getElementById("preview-magia").textContent = total.magia;
  }

  document.querySelectorAll(".race-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".race-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedRaza = {
        nombre: card.dataset.race,
        id: parseInt(card.dataset.id),
      };
      toggleSpellSection();
      actualizarStats();
    });
  });

  document.querySelectorAll(".class-card").forEach((card) => {
    card.addEventListener("click", () => {
      const claseNombre = card.dataset.class;
      const claseId = parseInt(card.dataset.id);

      if ((selectedRaza?.nombre === "orco" && claseNombre === "paladin") ||
          (selectedRaza?.nombre === "elfo" && claseNombre === "guerrero")) {
        alert("Combinación no permitida por las restricciones.");
        return;
      }

      document.querySelectorAll(".class-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      selectedClase = {
        nombre: claseNombre,
        id: claseId,
      };

      toggleSpellSection();
      actualizarStats();
    });
  });

  function toggleSpellSection() {
    const spellSection = document.getElementById("spell-section");
    if (selectedClase?.nombre === "hechicero" || selectedRaza?.nombre === "dragon") {
      spellSection.classList.remove("d-none");
    } else {
      spellSection.classList.add("d-none");
    }
  }

  const equipoList = document.getElementById("equipment-list");

  // NUEVA FUNCIÓN para agregar equipos sin tipo en el nombre
function agregarEquipo(tipo) {
  const nombre = prompt(`Nombre del ${tipo.toLowerCase()}`);
  if (!nombre) return;
  const li = document.createElement("li");
  li.classList.add("equipment-item");
  li.dataset.tipo = tipo;
  li.dataset.nombre = nombre;
  li.innerHTML = `
    <span class="equipment-nombre">${nombre}</span>
    <span class="badge bg-secondary ms-2">${tipo}</span>
    <button type="button" class="btn btn-sm btn-danger ms-2 remove-equipment-btn">x</button>
  `;
  li.querySelector('.remove-equipment-btn').onclick = () => li.remove();
  equipoList.appendChild(li);
}

  // Todos los botones de agregar equipo llaman a la nueva función
  document.getElementById("add-weapon").addEventListener("click", () => agregarEquipo("ARMA"));
  document.getElementById("add-armor").addEventListener("click", () => agregarEquipo("ARMADURA"));
  document.getElementById("add-item").addEventListener("click", () => agregarEquipo("OBJETO"));

  formBtn.addEventListener("click", async () => {
    const nombre = nameInput.value.trim();
    const nivel = parseInt(document.getElementById("character-level").value);
    const hechizoNombre = document.getElementById("spell-name")?.value || null;
    const hechizoDescripcion = document.getElementById("spell-description")?.value || null;

    // Ahora se recolecta nombre y tipo de cada equipo por separado
    const equipos = Array.from(document.querySelectorAll(".equipment-item")).map((el) => ({
      nombre: el.dataset.nombre,
      tipo: el.dataset.tipo,
    }));

    if (!nombre || !selectedClase?.id || !selectedRaza?.id) {
      alert("Debes completar nombre, raza y clase.");
      return;
    }

    if (equipos.length < 1) {
      alert("Debes agregar al menos un equipo.");
      return;
    }

    try {
      let hechizoId = null;

      if ((selectedClase.nombre === "hechicero" || selectedRaza.nombre === "dragon") &&
          hechizoNombre && hechizoDescripcion) {
        const hechizo = await apiRequest(
          "/api/hechizos",
          "POST",
          {
            nombre: hechizoNombre,
            nivel: `Nivel ${nivel}`,
            descripcion: hechizoDescripcion,
          },
          true
        );
        hechizoId = hechizo.id;
      }

      const equipoIds = await Promise.all(
        equipos.map((eq) =>
          apiRequest("/api/equipos", "POST", eq, true).then((e) => e.id)
        )
      );

      const personajePayload = {
        nombre,
        claseId: selectedClase.id,
        razaId: selectedRaza.id,
        equipoIds,
        hechizoIds: hechizoId ? [hechizoId] : [],
      };

      console.log("Payload a enviar:", personajePayload);

      const personajeCreado = await apiRequest("/api/personajes", "POST", personajePayload, true);

      await Promise.all(
        equipoIds.map(equipoId =>
          apiRequest(`/api/equipos/${equipoId}/asignar-personaje/${personajeCreado.id}`, "PUT", null, true)
        )
      );

      alert("Personaje creado con éxito.");
      window.location.href = "Galeria.html";
    } catch (err) {
      console.error(err);
      alert("Error al crear personaje: " + err.message);
    }
  });
});
