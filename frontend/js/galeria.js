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
      <ul>${character.equipo.map(e => `<li>${e}</li>`).join("") || '<li>Sin equipo</li>'}</ul>
    `;

    const modal = new bootstrap.Modal(document.getElementById("characterModal"));
    modal.show();

    document.getElementById("export-pdf-btn").onclick = () => {
      exportPDF(character);
    };
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
