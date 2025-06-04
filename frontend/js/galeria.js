// galeria.js con integración al backend usando fetchWithAuth

import { fetchWithAuth } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const galeriaContainer = document.getElementById("galeria-personajes");
  const noCharactersContainer = document.getElementById("no-characters-container");
  const filtroRaza = document.getElementById("filtro-raza");
  const filtroClase = document.getElementById("filtro-clase");

  let allCharacters = [];
  let filteredCharacters = [];

  try {
    allCharacters = await fetchWithAuth("/api/personajes");
    filteredCharacters = [...allCharacters];
  } catch (err) {
    galeriaContainer.innerHTML = '<p class="text-danger">Error al cargar personajes. Inicia sesión nuevamente.</p>';
    return;
  }

  if (!allCharacters.length) {
    noCharactersContainer.classList.remove("d-none");
    return;
  }

  const uniqueRaces = [...new Set(allCharacters.map(c => c.race).filter(Boolean))];
  const uniqueClasses = [...new Set(allCharacters.map(c => c.class).filter(Boolean))];

  uniqueRaces.forEach(r => {
    const option = document.createElement("option");
    option.value = r;
    option.textContent = r;
    filtroRaza.appendChild(option);
  });

  uniqueClasses.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    filtroClase.appendChild(option);
  });

  filtroRaza.addEventListener("change", aplicarFiltros);
  filtroClase.addEventListener("change", aplicarFiltros);

  function aplicarFiltros() {
    const raza = filtroRaza.value;
    const clase = filtroClase.value;
    filteredCharacters = allCharacters.filter(c => {
      return (raza === "" || c.race === raza) &&
             (clase === "" || c.class === clase);
    });
    renderCharacters();
  }

  renderCharacters();

  function renderCharacters() {
    galeriaContainer.innerHTML = '';
    if (filteredCharacters.length === 0) {
      galeriaContainer.innerHTML = '<p class="text-center">No se encontraron personajes con los filtros seleccionados.</p>';
      return;
    }

    filteredCharacters.forEach(character => {
      const characterCard = document.createElement('div');
      characterCard.className = 'col-md-4 col-lg-3 mb-4';
      characterCard.innerHTML = `
        <div class="card h-100 shadow-sm hover-card">
          <div class="card-header text-center py-3" style="background-color: var(--primary); color: white;">
            <h4 class="card-title h5 mb-0">${character.name}</h4>
          </div>
          <div class="card-body">
            <div class="text-center mb-3">
              <div class="character-avatar rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                   style="width: 80px; height: 80px; font-size: 2rem; background-color: var(--primary); color: white;">
                <span>${character.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <p class="card-text"><strong>Raza:</strong> ${character.race || 'No especificada'}</p>
            <p class="card-text"><strong>Clase:</strong> ${character.class || 'No especificada'}</p>
            <p class="card-text"><strong>Nivel:</strong> ${character.level || '1'}</p>
            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-sm view-character" data-character-id="${character.id}" style="background-color: var(--primary); color: white;">
                <i class="bi bi-eye me-2"></i>Ver detalles
              </button>
              <a href="creacion.html?id=${character.id}" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-pencil me-2"></i>Editar
              </a>
              <button class="btn btn-sm btn-outline-danger delete-character" data-character-id="${character.id}">
                <i class="bi bi-trash me-2"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
      galeriaContainer.appendChild(characterCard);
    });

    document.querySelectorAll('.view-character').forEach(button => {
      button.addEventListener('click', function () {
        const characterId = this.getAttribute('data-character-id');
        showCharacterDetails(characterId);
      });
    });

    document.querySelectorAll('.delete-character').forEach(button => {
      button.addEventListener('click', async function () {
        const characterId = this.getAttribute('data-character-id');
        if (confirm('¿Estás seguro de que deseas eliminar este personaje?')) {
          try {
            await fetchWithAuth(`/api/personajes/${characterId}`, { method: "DELETE" });
            allCharacters = allCharacters.filter(c => c.id !== characterId);
            aplicarFiltros();
            showNotification('Personaje eliminado con éxito');
          } catch (err) {
            alert("Error al eliminar personaje");
          }
        }
      });
    });
  }

  function showCharacterDetails(characterId) {
    const character = allCharacters.find(c => c.id === characterId);
    if (!character) return;

    document.getElementById('character-name').textContent = character.name;
    document.getElementById('character-race-class').textContent = `${character.race} - ${character.class} - Nivel ${character.level}`;
    document.getElementById('character-avatar-initial').textContent = character.name.charAt(0).toUpperCase();
    document.getElementById('edit-character-link').href = `creacion.html?id=${character.id}`;

    const statsContainer = document.getElementById('character-stats');
    statsContainer.innerHTML = '';
    ["fuerza", "destreza", "defensa", "magia"].forEach(stat => {
      const val = character.stats?.[stat] || 8;
      const statCol = document.createElement('div');
      statCol.className = 'col-6 col-md-3 text-center';
      statCol.innerHTML = `
        <div class="stat-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
             style="width: 50px; height: 50px; background-color: rgba(219, 148, 41, 0.2);">
          <span style="color: var(--primary); font-weight: bold;">${val}</span>
        </div>
        <p class="mb-0 small text-uppercase">${stat}</p>
      `;
      statsContainer.appendChild(statCol);
    });

    const abilitiesContainer = document.getElementById('character-abilities');
    abilitiesContainer.innerHTML = '';

    if (character.spell?.name) {
      const spellDiv = document.createElement('div');
      spellDiv.innerHTML = `
        <h5 class="h6 mb-2">Hechizo</h5>
        <p><strong>${character.spell.name}</strong>: ${character.spell.description}</p>
      `;
      abilitiesContainer.appendChild(spellDiv);
    }

    const equipo = character.equipo || { armas: [], armaduras: [], objetos: [] };
    const equipoList = document.createElement('div');
    equipoList.innerHTML = `
      <h5 class="h6 mb-2 mt-3">Equipamiento</h5>
      <ul class="list-group list-group-flush">
        ${equipo.armas.map(i => `<li class="list-group-item">Arma: ${i}</li>`).join('')}
        ${equipo.armaduras.map(i => `<li class="list-group-item">Armadura: ${i}</li>`).join('')}
        ${equipo.objetos.map(i => `<li class="list-group-item">Objeto: ${i}</li>`).join('')}
      </ul>
    `;
    abilitiesContainer.appendChild(equipoList);

    new bootstrap.Modal(document.getElementById('characterModal')).show();
  }

  function showNotification(message, type = 'success') {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = "top: 20px; right: 20px; z-index: 1050; min-width: 300px;";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("fade");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 150);
    }, 3000);
  }
});
