// creacion.js completo y funcional con integración al backend

import { fetchWithAuth } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  let characterData = {
    name: "",
    level: 1,
    race: "",
    class: "",
    stats: { fuerza: 8, destreza: 8, defensa: 8, magia: 8 },
    baseStats: { fuerza: 8, destreza: 8, defensa: 8, magia: 8 },
    spell: { name: "", description: "" },
    equipo: { armas: [], armaduras: [], objetos: [] }
  };

  let pointsRemaining = 27;
  const maxStatValue = 15;
  const minStatValue = 8;

  const raceBonuses = {
    humano: { fuerza: 2, destreza: 3, defensa: 2, magia: -3 },
    orco: { fuerza: 3, destreza: -1, defensa: 3, magia: 0 },
    enano: { fuerza: 1, destreza: -3, defensa: 5, magia: 1 },
    elfo: { fuerza: -2, destreza: 2, defensa: 0, magia: 4 },
    dragon: { fuerza: 3, destreza: -2, defensa: 0, magia: 4 }
  };

  const classBonuses = {
    guerrero: { fuerza: 4, destreza: 3, defensa: 1, magia: -4 },
    paladin: { fuerza: 2, destreza: -5, defensa: 6, magia: 2 },
    hechicero: { fuerza: -2, destreza: -2, defensa: 2, magia: 6 }
  };

  const classRestrictions = {
    orco: ["paladin"],
    elfo: ["guerrero"]
  };

  const characterNameInput = document.getElementById("character-name");
  const characterLevelSelect = document.getElementById("character-level");
  const raceCards = document.querySelectorAll(".race-card");
  const classCards = document.querySelectorAll(".class-card");
  const pointsRemainingSpan = document.getElementById("points-remaining");
  const spellNameInput = document.getElementById("spell-name");
  const spellDescriptionInput = document.getElementById("spell-description");

  init();

  function init() {
    setupEventListeners();
    updatePreview();
    updateStatDisplay();
    setTimeout(loadDraft, 500);
  }

  function setupEventListeners() {
    characterNameInput.addEventListener("input", e => {
      characterData.name = e.target.value;
      updatePreview();
    });

    characterLevelSelect.addEventListener("change", e => {
      characterData.level = parseInt(e.target.value);
      updatePreview();
    });

    raceCards.forEach(card => card.addEventListener("click", () => selectRace(card.dataset.race)));
    classCards.forEach(card => card.addEventListener("click", () => selectClass(card.dataset.class)));

    ["fuerza", "destreza", "defensa", "magia"].forEach(stat => {
      document.getElementById(`increase-${stat}`).addEventListener("click", () => increaseStat(stat));
      document.getElementById(`decrease-${stat}`).addEventListener("click", () => decreaseStat(stat));
    });

    document.getElementById("reset-stats").addEventListener("click", resetStats);
    document.getElementById("random-stats").addEventListener("click", randomizeStats);
    document.getElementById("create-character").addEventListener("click", createCharacter);
    document.getElementById("save-draft").addEventListener("click", saveDraft);

    document.getElementById("add-weapon")?.addEventListener("click", () => addEquipment('arma'));
    document.getElementById("add-armor")?.addEventListener("click", () => addEquipment('armadura'));
    document.getElementById("add-item")?.addEventListener("click", () => addEquipment('objeto'));
  }

  function selectRace(race) {
    raceCards.forEach(card => card.classList.remove("selected"));
    const selectedCard = document.querySelector(`[data-race="${race}"]`);
    selectedCard.classList.add("selected");
    characterData.race = race;
    toggleSpellSection();
    updatePreview();
  }

  function selectClass(clas) {
    if (characterData.race && classRestrictions[characterData.race]?.includes(clas)) {
      alert(`Los ${characterData.race}s no pueden ser ${clas}es`);
      return;
    }
    classCards.forEach(card => card.classList.remove("selected"));
    const selectedCard = document.querySelector(`[data-class="${clas}"]`);
    selectedCard.classList.add("selected");
    characterData.class = clas;
    toggleSpellSection();
    updatePreview();
  }

  function toggleSpellSection() {
    const section = document.getElementById("spell-section");
    if (characterData.class === "hechicero" || characterData.race === "dragon") {
      section?.classList.remove("d-none");
    } else {
      section?.classList.add("d-none");
    }
  }

  function getFinalStat(stat) {
    let total = characterData.baseStats[stat];
    if (raceBonuses[characterData.race]) total += raceBonuses[characterData.race][stat] || 0;
    if (classBonuses[characterData.class]) total += classBonuses[characterData.class][stat] || 0;
    return total;
  }

  function updateStatDisplay() {
    ["fuerza", "destreza", "defensa", "magia"].forEach(stat => {
      document.getElementById(`${stat}-value`).textContent = characterData.baseStats[stat];
      document.getElementById(`${stat}-display`).textContent = getFinalStat(stat);
      document.getElementById(`${stat}-bar`).style.width = `${(getFinalStat(stat) - 8) * 100 / 12}%`;
    });
    pointsRemainingSpan.textContent = pointsRemaining;
  }

  function increaseStat(stat) {
    const cost = getStatCost(characterData.baseStats[stat]);
    if (characterData.baseStats[stat] < maxStatValue && pointsRemaining >= cost) {
      characterData.baseStats[stat]++;
      pointsRemaining -= cost;
      updateStatDisplay();
    }
  }

  function decreaseStat(stat) {
    if (characterData.baseStats[stat] > minStatValue) {
      characterData.baseStats[stat]--;
      pointsRemaining += getStatCost(characterData.baseStats[stat]);
      updateStatDisplay();
    }
  }

  function getStatCost(val) {
    return val >= 13 ? 2 : 1;
  }

  function resetStats() {
    characterData.baseStats = { fuerza: 8, destreza: 8, defensa: 8, magia: 8 };
    pointsRemaining = 27;
    updateStatDisplay();
  }

  function randomizeStats() {
    resetStats();
    const stats = ["fuerza", "destreza", "defensa", "magia"];
    while (pointsRemaining > 0) {
      const s = stats[Math.floor(Math.random() * stats.length)];
      if (characterData.baseStats[s] < maxStatValue) {
        const cost = getStatCost(characterData.baseStats[s]);
        if (pointsRemaining >= cost) {
          characterData.baseStats[s]++;
          pointsRemaining -= cost;
        }
      }
    }
    updateStatDisplay();
  }

  function updatePreview() {
    document.getElementById("preview-name").textContent = characterData.name || "Nombre del personaje";
    document.getElementById("preview-race-class").textContent = `${characterData.race || "?"} - ${characterData.class || "?"}`;
    document.getElementById("preview-level").textContent = `Nivel ${characterData.level}`;
    ["fuerza", "destreza", "defensa", "magia"].forEach(stat => {
      document.getElementById(`preview-${stat}`).textContent = getFinalStat(stat);
    });
  }

  function validateCharacter() {
    const errors = [];
    if (!characterData.name.trim()) errors.push("Nombre obligatorio");
    if (!characterData.race) errors.push("Selecciona una raza");
    if (!characterData.class) errors.push("Selecciona una clase");
    const eq = characterData.equipo;
    if ((!eq.armas.length && !eq.armaduras.length && !eq.objetos.length)) {
      errors.push("Agrega al menos un arma, armadura u objeto");
    }
    if (pointsRemaining > 0) errors.push("Debes asignar todos los puntos de estadística");
    if (errors.length) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  }

  function addEquipment(type) {
    const name = prompt(`Nombre del/la ${type}`);
    if (!name?.trim()) return;
    characterData.equipo[type + 's'].push(name.trim());
    renderEquipment();
  }

  function renderEquipment() {
    const container = document.getElementById("equipment-list");
    container.innerHTML = "";
    ["armas", "armaduras", "objetos"].forEach(type => {
      if (characterData.equipo[type].length) {
        const group = document.createElement("div");
        group.innerHTML = `<h5 class="mt-3">${type}</h5>`;
        characterData.equipo[type].forEach((item, idx) => {
          const row = document.createElement("div");
          row.className = "d-flex align-items-center mb-2";
          row.innerHTML = `
            <span class="me-2">${item}</span>
            <button class="btn btn-sm btn-danger" onclick="removeEquipment('${type.slice(0, -1)}', ${idx})">
              <i class="bi bi-trash"></i>
            </button>
          `;
          group.appendChild(row);
        });
        container.appendChild(group);
      }
    });
  }

  window.removeEquipment = function(type, idx) {
    characterData.equipo[type + 's'].splice(idx, 1);
    renderEquipment();
  }

  function saveDraft() {
    characterData.spell.name = spellNameInput?.value.trim() || "";
    characterData.spell.description = spellDescriptionInput?.value.trim() || "";
    localStorage.setItem("characterDraft", JSON.stringify(characterData));
    alert("Borrador guardado correctamente");
  }

  function loadDraft() {
    const draft = localStorage.getItem("characterDraft");
    if (!draft) return;
    const draftData = JSON.parse(draft);
    characterData = { ...draftData };
    characterNameInput.value = characterData.name;
    characterLevelSelect.value = characterData.level;
    spellNameInput.value = characterData.spell?.name || "";
    spellDescriptionInput.value = characterData.spell?.description || "";
    if (characterData.race) selectRace(characterData.race);
    if (characterData.class) selectClass(characterData.class);
    renderEquipment();
    let usedPoints = 0;
    Object.values(characterData.baseStats).forEach(val => {
      for (let i = 8; i < val; i++) usedPoints += getStatCost(i);
    });
    pointsRemaining = 27 - usedPoints;
    updateStatDisplay();
    updatePreview();
  }

  function createCharacter() {
    characterData.spell.name = spellNameInput?.value.trim() || "";
    characterData.spell.description = spellDescriptionInput?.value.trim() || "";
    if (!validateCharacter()) return;

    const payload = {
      nombre: characterData.name,
      nivel: characterData.level,
      raza: characterData.race,
      clase: characterData.class,
      hechizo: characterData.spell,
      equipo: characterData.equipo,
      estadisticas: {
        fuerza: getFinalStat("fuerza"),
        destreza: getFinalStat("destreza"),
        defensa: getFinalStat("defensa"),
        magia: getFinalStat("magia")
      }
    };

    fetchWithAuth("/api/personajes", {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert("¡Personaje creado exitosamente!");
      window.location.href = "Galeria.html";
    })
    .catch(error => {
      console.error(error);
      alert("Error al crear el personaje.");
    });
  }
});
