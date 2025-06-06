import { apiRequest } from "./api.js";
import { requireAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  const galeriaContainer = document.getElementById("galeria-personajes");
  const noCharactersContainer = document.getElementById("no-characters-container");
  const filtroRaza = document.getElementById("filtro-raza");
  const filtroClase = document.getElementById("filtro-clase");

  let allCharacters = [];

  try {
    allCharacters = await apiRequest("/api/personajes/mios", "GET", null, true);
  } catch (err) {
    galeriaContainer.innerHTML = '<p class="text-danger">Error al cargar personajes.</p>';
    return;
  }

  if (!allCharacters.length) {
    noCharactersContainer.classList.remove("d-none");
    return;
  }

  const uniqueRaces = [...new Set(allCharacters.map(c => c.raza))];
  const uniqueClasses = [...new Set(allCharacters.map(c => c.clase))];

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

  filtroRaza.addEventListener("change", renderCharacters);
  filtroClase.addEventListener("change", renderCharacters);

  renderCharacters();

  function renderCharacters() {
    galeriaContainer.innerHTML = '';
    const razaFilter = filtroRaza.value;
    const claseFilter = filtroClase.value;
    const filtered = allCharacters.filter(c =>
      (!razaFilter || c.raza === razaFilter) &&
      (!claseFilter || c.clase === claseFilter)
    );

    if (!filtered.length) {
      galeriaContainer.innerHTML = '<p class="text-center">No se encontraron personajes.</p>';
      return;
    }

    filtered.forEach(character => {
      const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
      const card = document.createElement('div');
      card.className = 'col-md-4 col-lg-3 mb-4';
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="img/${imgName}" class="character-card-avatar" alt="Avatar">
          <div class="card-body text-center">
            <h5>${character.nombre}</h5>
            <p class="">${character.raza} - ${character.clase}</p>
            <button class="btn btn-primary btn-sm view-character" data-id="${character.id}">
              Ver detalles
            </button>
            <button class="btn btn-danger btn-sm delete-character ms-2" data-id="${character.id}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
      galeriaContainer.appendChild(card);
    });

    document.querySelectorAll('.view-character').forEach(btn => {
      btn.addEventListener('click', () => {
        const charId = parseInt(btn.dataset.id);
        const character = allCharacters.find(c => c.id === charId);
        showDetails(character);
      });
    });

      document.querySelectorAll('.delete-character').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const charId = parseInt(btn.dataset.id);
      if (confirm('¿Seguro que deseas eliminar este personaje?')) {
        try {
          await apiRequest(`/api/personajes/${charId}`, "DELETE", null, true);
          // Elimina el personaje del array local
          allCharacters = allCharacters.filter(c => c.id !== charId);
          renderCharacters(); // Vuelve a renderizar la galería
        } catch (error) {
          alert('Error al eliminar el personaje.');
        }
      }
    });
  });
  }

  function showDetails(character) {
    document.getElementById("character-name").textContent = character.nombre;
    document.getElementById("character-race-class").textContent = `${character.raza} - ${character.clase}`;
    const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
    document.getElementById("character-avatar-img").src = `img/${imgName}`;

    const stats = [
      { label: "Fuerza", value: character.fuerza },
      { label: "Destreza", value: character.destreza },
      { label: "Resistencia", value: character.resistencia },
      { label: "Magia", value: character.magia }
    ];

    const statsContainer = document.getElementById("character-stats");
    statsContainer.innerHTML = stats.map(stat => `
      <div class="col-6 col-md-3 text-center mb-3">
        <div class="stat-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
             style="width: 50px; height: 50px; background-color: rgba(219, 148, 41, 0.2);">
          <span style="color: var(--primary); font-weight: bold;">${stat.value}</span>
        </div>
        <small>${stat.label}</small>
      </div>
    `).join("");

    const abilitiesContainer = document.getElementById("character-abilities");
  abilitiesContainer.innerHTML = `
    <h5>Hechizos:</h5>
    <ul>${character.hechizos.map(h => `<li>${h}</li>`).join("") || '<li>Ninguno</li>'}</ul>
    <h5>Equipamiento:</h5>
    <ul id="equipos-editables" style="list-style:none; padding-left:0;">
      ${character.equipo.map((e, i) => `
        <li class="mb-2">
          <input type="text" value="${e.nombre}" data-idx="${i}" class="form-control d-inline-block equipo-nombre" style="width:60%; display:inline;">
          <span class="badge bg-secondary ms-2">${e.tipo}</span>
          <button class="btn btn-sm btn-success ms-2 save-equipo" data-idx="${i}" title="Guardar cambios"><i class="bi bi-check"></i></button>
          <button class="btn btn-sm btn-danger ms-1 delete-equipo" data-idx="${i}" title="Eliminar equipo"><i class="bi bi-trash"></i></button>
        </li>
      `).join("")}
    </ul>
    <hr>
    <div class="d-flex align-items-center gap-2 mb-2">
      <input type="text" id="nuevo-equipo-nombre" class="form-control" placeholder="Nuevo equipo" style="width: 60%;">
      <select id="nuevo-equipo-tipo" class="form-select" style="width: 30%;">
        <option value="ARMA">ARMA</option>
        <option value="ARMADURA">ARMADURA</option>
        <option value="OBJETO">OBJETO</option>
      </select>
      <button id="add-equipo-btn" class="btn btn-primary" title="Añadir equipo"><i class="bi bi-plus-circle"></i></button>
    </div>
  `;

    const modal = new bootstrap.Modal(document.getElementById("characterModal"));
    modal.show();

    document.getElementById("export-pdf-btn").onclick = () => {
      exportPDF(character);
    };
    // Guardar cambios en el equipo
document.querySelectorAll('.save-equipo').forEach(btn => {
  btn.addEventListener('click', async () => {
    const idx = btn.dataset.idx;
    const input = document.querySelector(`input[data-idx='${idx}']`);
    const nuevoNombre = input.value.trim();
    if (!nuevoNombre) return alert('El nombre no puede estar vacío.');
    try {
      await apiRequest(`/api/equipos/${character.equipo[idx].id}`, "PUT", { nombre: nuevoNombre }, true);
      character.equipo[idx].nombre = nuevoNombre;
      input.classList.add('border-success');
      setTimeout(() => input.classList.remove('border-success'), 800);
    } catch (err) {
      alert('Error al guardar el equipo');
    }
  });
});

// Eliminar equipo
document.querySelectorAll('.delete-equipo').forEach(btn => {
  btn.addEventListener('click', async () => {
    const idx = btn.dataset.idx;
    if (!confirm('¿Eliminar este equipo?')) return;
    try {
      await apiRequest(`/api/equipos/${character.equipo[idx].id}`, "DELETE", null, true);
      character.equipo.splice(idx, 1);
      showDetails(character); // Vuelve a mostrar el modal actualizado
    } catch (err) {
      alert('Error al eliminar el equipo');
    }
  });
});

// Añadir nuevo equipo
document.getElementById('add-equipo-btn').addEventListener('click', async () => {
  const nombre = document.getElementById('nuevo-equipo-nombre').value.trim();
  const tipo = document.getElementById('nuevo-equipo-tipo').value;
  if (!nombre) return alert('El nombre del equipo no puede estar vacío.');
  try {
    const nuevo = await apiRequest("/api/equipos", "POST", { nombre, tipo }, true);
    // Asignar a este personaje
    await apiRequest(`/api/equipos/${nuevo.id}/asignar-personaje/${character.id}`, "PUT", null, true);
    character.equipo.push(nuevo);
    showDetails(character); // Recarga la lista
  } catch (err) {
    alert('Error al añadir equipo');
  }
});

  }

  // Exportar a PDF con imagen
  async function exportPDF(character) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const marginX = 20;
    let cursorY = 20;

    const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
    const imgURL = `img/${imgName}`;
    const imgData = await getBase64ImageFromUrl(imgURL);
    doc.addImage(imgData, "PNG", marginX, cursorY, 40, 60);

    doc.setFontSize(22);
    doc.setTextColor(33, 37, 41);
    doc.text(character.nombre, marginX + 50, cursorY + 10);
    doc.setFontSize(14);
    doc.text(`Raza: ${character.raza}`, marginX + 50, cursorY + 25);
    doc.text(`Clase: ${character.clase}`, marginX + 50, cursorY + 35);

    cursorY += 70;

    doc.setFontSize(16);
    doc.setTextColor(219, 148, 41);
    doc.text("Estadísticas", marginX, cursorY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    cursorY += 10;

    doc.text(`Fuerza: ${character.fuerza}`, marginX, cursorY);
    doc.text(`Destreza: ${character.destreza}`, marginX + 60, cursorY);
    cursorY += 8;
    doc.text(`Resistencia: ${character.resistencia}`, marginX, cursorY);
    doc.text(`Magia: ${character.magia}`, marginX + 60, cursorY);
    cursorY += 15;

    doc.setFontSize(16);
    doc.setTextColor(219, 148, 41);
    doc.text("Hechizos", marginX, cursorY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    cursorY += 10;

    if (character.hechizos.length) {
      character.hechizos.forEach(h => {
        doc.text(`- ${h}`, marginX + 5, cursorY);
        cursorY += 7;
      });
    } else {
      doc.text("- Ninguno", marginX + 5, cursorY);
      cursorY += 7;
    }

    cursorY += 10;
    doc.setFontSize(16);
    doc.setTextColor(219, 148, 41);
    doc.text("Equipamiento", marginX, cursorY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    cursorY += 10;

    if (character.equipo.length) {
      character.equipo.forEach(e => {
        doc.text(`- ${e}`, marginX + 5, cursorY);
        cursorY += 7;
      });
    } else {
      doc.text("- Sin equipo", marginX + 5, cursorY);
    }

    doc.save(`${character.nombre}.pdf`);
  }

  async function getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", err => reject(err));
      reader.readAsDataURL(blob);
    });
  }
});
