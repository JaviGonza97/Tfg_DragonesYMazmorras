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
            allCharacters = allCharacters.filter(c => c.id !== charId);
            renderCharacters();
          } catch (error) {
            alert('Error al eliminar el personaje.');
          }
        }
      });
    });
  }

  // ---- EDICIÓN DE EQUIPO ----

  // Helper para crear fila de equipo (input + select tipo + eliminar)
  const tipos = ["ARMA", "ARMADURA", "OBJETO"];
  function crearFilaEquipo(nombre = "", tipo = "ARMA") {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-2";
    li.innerHTML = `
      <input type="text" class="form-control form-control-sm me-2" value="${nombre}" placeholder="Nombre del equipo" required style="font-weight:bold;">
      <select class="form-select form-select-sm me-2" style="width:auto;">
        ${tipos.map(t => `<option value="${t}"${t === tipo ? " selected" : ""}>${t}</option>`).join("")}
      </select>
      <button class="btn btn-danger btn-sm remove-equipment-btn" type="button"><i class="bi bi-x"></i></button>
    `;
    li.querySelector('.remove-equipment-btn').onclick = function () {
      li.remove();
    };
    return li;
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

    // ---- VISTA DE EQUIPO (SOLO NOMBRE Y BADGE DE TIPO) ----
    const abilitiesContainer = document.getElementById("character-abilities");
    abilitiesContainer.innerHTML = `
      <h5>Hechizos:</h5>
      <ul>
        ${character.hechizos.map(h => `<li>${h}</li>`).join("") || '<li>Ninguno</li>'}
      </ul>
      <h5>Equipamiento:</h5>
      <ul>
        ${character.equipo.map(e => {
          let nombre = e.nombre ?? e, tipo = e.tipo ?? "";
          // Soporta tanto array de strings como array de objetos
          if (typeof e === "string") {
            const match = e.match?.(/\((ARMA|ARMADURA|OBJETO)\)$/);
            if (match) {
              tipo = match[1];
              nombre = e.replace(/\s*\((ARMA|ARMADURA|OBJETO)\)$/, "").trim();
            }
          }
          return `<li>${nombre}${tipo ? ` <span class="badge bg-secondary ms-2">${tipo}</span>` : ""}</li>`;
        }).join("") || '<li>Sin equipo</li>'}
      </ul>
    `;

    // -------------------
    // EDICIÓN DE EQUIPO
    // -------------------
    document.getElementById("edit-equipment-btn").onclick = function () {
      abilitiesContainer.classList.add("d-none");
      document.getElementById("edit-equipment-section").classList.remove("d-none");

      const list = document.getElementById("edit-equipment-list");
      list.innerHTML = "";

      // Parsear los equipos: nombre y tipo (soporta ambos formatos)
      character.equipo.forEach(e => {
        let nombre = e.nombre ?? e, tipo = e.tipo ?? "ARMA";
        if (typeof e === "string") {
          const match = e.match?.(/\((ARMA|ARMADURA|OBJETO)\)$/);
          if (match) {
            tipo = match[1];
            nombre = e.replace(/\s*\((ARMA|ARMADURA|OBJETO)\)$/, "").trim();
          }
        }
        list.appendChild(crearFilaEquipo(nombre, tipo));
      });
    };

    // Agregar equipo nuevo
    document.getElementById("add-equipment-btn").onclick = function () {
      const list = document.getElementById("edit-equipment-list");
      list.appendChild(crearFilaEquipo());
    };

    // Cancelar edición
    document.getElementById("cancel-equipment-btn").onclick = function () {
      document.getElementById("edit-equipment-section").classList.add("d-none");
      abilitiesContainer.classList.remove("d-none");
    };

document.getElementById("save-equipment-btn").onclick = async function () {
  const lis = document.querySelectorAll("#edit-equipment-list li");
  const newEquipment = Array.from(lis)
    .map(li => {
      const nombre = li.querySelector('input').value.trim();
      const tipo = li.querySelector('select').value.toUpperCase();
      return nombre && tipo ? { nombre, tipo } : null;
    })
    .filter(v => v);

  // Validación frontend
  const tiposValidos = ["ARMA", "ARMADURA", "OBJETO"];
  const equiposValidados = newEquipment.filter(eq => {
    if (!eq.nombre || !tiposValidos.includes(eq.tipo)) {
      alert(`Equipo inválido:\n${JSON.stringify(eq, null, 2)}\n\nDebe tener nombre y tipo válido (ARMA, ARMADURA, OBJETO).`);
      return false;
    }
    return true;
  });
  if (equiposValidados.length !== newEquipment.length) {
    // Hay inválidos, no se envía nada al backend.
    return;
  }

  try {
    // Puedes dejar el log para debug:
    console.log("Enviando al backend:", equiposValidados);
    await apiRequest(`/api/personajes/${character.id}/equipo`, "PUT", equiposValidados, true);
    alert("Equipo actualizado correctamente");
    location.reload();
  } catch (err) {
    alert("Error al actualizar el equipo: " + err.message);
  }
};


    // Exportar PDF
    document.getElementById("export-pdf-btn").onclick = () => {
      exportPDF(character);
    };

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("characterModal"));
    modal.show();
  }

// Función mejorada para exportar PDF con diseño temático de D&D
async function exportPDF(character) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");
  
  // Colores temáticos
  const goldColor = [218, 165, 32];
  const darkBrown = [101, 67, 33];
  const parchmentColor = [245, 235, 220];
  const redAccent = [139, 69, 19];
  
  // Función para crear fondo de pergamino
  function createParchmentBackground() {
    // Fondo base
    doc.setFillColor(...parchmentColor);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Efectos de envejecimiento
    doc.setFillColor(222, 184, 135);
    doc.setGState(new doc.GState({opacity: 0.3}));
    
    // Manchas aleatorias para efecto envejecido
    for(let i = 0; i < 15; i++) {
      const x = Math.random() * 200;
      const y = Math.random() * 280;
      const size = Math.random() * 20 + 5;
      doc.circle(x, y, size, 'F');
    }
    
    doc.setGState(new doc.GState({opacity: 1}));
  }
  
  // Función para dibujar bordes decorativos
  function drawDecorativeBorders() {
    doc.setDrawColor(...darkBrown);
    doc.setLineWidth(2);
    
    // Borde exterior
    doc.rect(10, 10, 190, 277);
    
    // Borde interior decorativo
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 267);
    
    // Esquinas decorativas
    const cornerSize = 15;
    // Esquina superior izquierda
    doc.setFillColor(...goldColor);
    doc.triangle(15, 15, 30, 15, 15, 30, 'F');
    
    // Esquina superior derecha
    doc.triangle(195, 15, 180, 15, 195, 30, 'F');
    
    // Esquina inferior izquierda
    doc.triangle(15, 282, 30, 282, 15, 267, 'F');
    
    // Esquina inferior derecha
    doc.triangle(195, 282, 180, 282, 195, 267, 'F');
  }
  
  // Función para crear líneas rellenables
  function drawFillableLines(x, y, width, spacing = 6, count = 1) {
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    for(let i = 0; i < count; i++) {
      const lineY = y + (i * spacing);
      doc.line(x, lineY, x + width, lineY);
    }
  }
  
  // Función para crear cajas decorativas
  function drawDecorativeBox(x, y, width, height, title) {
    // Fondo de la caja
    doc.setFillColor(240, 230, 210);
    doc.roundedRect(x, y, width, height, 3, 3, 'F');
    
    // Borde de la caja
    doc.setDrawColor(...darkBrown);
    doc.setLineWidth(1);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');
    
    // Título de la caja
    if(title) {
      doc.setFillColor(...goldColor);
      doc.roundedRect(x + 5, y - 4, doc.getTextWidth(title) + 6, 8, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, x + 8, y + 1);
    }
  }
  
  // Crear el fondo
  createParchmentBackground();
  drawDecorativeBorders();
  
  // TÍTULO PRINCIPAL
  doc.setTextColor(...darkBrown);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const title = "HOJA DE PERSONAJE";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (210 - titleWidth) / 2, 35);
  
  // Subtítulo decorativo
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const subtitle = "~ Dragones y Mazmorras ~";
  const subtitleWidth = doc.getTextWidth(subtitle);
  doc.text(subtitle, (210 - subtitleWidth) / 2, 42);
  
  // INFORMACIÓN BÁSICA DEL PERSONAJE
  let currentY = 55;
  
  // Caja de información básica
  drawDecorativeBox(20, currentY, 170, 45, "INFORMACIÓN BÁSICA");
  
  // Nombre del personaje
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("NOMBRE:", 25, currentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(character.nombre, 55, currentY + 15);
  drawFillableLines(55, currentY + 17, 100);
  
  // Raza y Clase
  doc.setFont("helvetica", "bold");
  doc.text("RAZA:", 25, currentY + 28);
  doc.setFont("helvetica", "normal");
  doc.text(character.raza, 45, currentY + 28);
  drawFillableLines(45, currentY + 30, 60);
  
  doc.setFont("helvetica", "bold");
  doc.text("CLASE:", 120, currentY + 28);
  doc.setFont("helvetica", "normal");
  doc.text(character.clase, 145, currentY + 28);
  drawFillableLines(145, currentY + 30, 40);
  
  // Nivel (espacio rellenable)
  doc.setFont("helvetica", "bold");
  doc.text("NIVEL:", 25, currentY + 40);
  drawFillableLines(45, currentY + 42, 20);
  
  // Experiencia (espacio rellenable)
  doc.setFont("helvetica", "bold");
  doc.text("EXPERIENCIA:", 80, currentY + 40);
  drawFillableLines(120, currentY + 42, 50);
  
  currentY += 55;
  
  // ESTADÍSTICAS PRINCIPALES
  drawDecorativeBox(20, currentY, 85, 80, "ATRIBUTOS PRINCIPALES");
  
  const stats = [
    { name: "FUERZA", value: character.fuerza },
    { name: "DESTREZA", value: character.destreza },
    { name: "RESISTENCIA", value: character.resistencia },
    { name: "MAGIA", value: character.magia }
  ];
  
  stats.forEach((stat, index) => {
    const statY = currentY + 15 + (index * 15);
    
    // Círculo decorativo para el valor
    doc.setFillColor(...goldColor);
    doc.circle(35, statY - 2, 8, 'F');
    doc.setDrawColor(...darkBrown);
    doc.circle(35, statY - 2, 8, 'S');
    
    // Valor de la estadística
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value.toString(), stat.value < 10 ? 32 : 30, statY + 1);
    
    // Nombre de la estadística
    doc.setFontSize(10);
    doc.text(stat.name, 50, statY + 1);
    
    // Modificador (espacio rellenable)
    doc.text("MOD:", 85, statY + 1);
    drawFillableLines(95, statY + 2, 8);
  });
  
  // ESTADÍSTICAS SECUNDARIAS
  drawDecorativeBox(110, currentY, 80, 80, "ESTADÍSTICAS SECUNDARIAS");
  
  const secondaryStats = [
    "PUNTOS DE VIDA",
    "CLASE DE ARMADURA", 
    "VELOCIDAD",
    "INICIATIVA",
    "COMPETENCIA"
  ];
  
  secondaryStats.forEach((stat, index) => {
    const statY = currentY + 15 + (index * 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(stat, 115, statY);
    drawFillableLines(160, statY + 1, 25);
  });
  
  currentY += 90;
  
  // HABILIDADES Y COMPETENCIAS
  drawDecorativeBox(20, currentY, 170, 60, "HABILIDADES Y COMPETENCIAS");
  
  // Hechizos
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("HECHIZOS CONOCIDOS:", 25, currentY + 15);
  
  let spellY = currentY + 25;
  if (character.hechizos.length > 0) {
    character.hechizos.forEach((spell, index) => {
      if (index < 3) { // Máximo 3 hechizos para que quepa
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`• ${spell}`, 30, spellY);
        spellY += 8;
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Ninguno", 30, spellY);
  }
  
  // Espacios adicionales para hechizos
  for(let i = 0; i < 3; i++) {
    drawFillableLines(100, currentY + 25 + (i * 8), 80);
  }
  
  currentY += 70;
  
  // EQUIPAMIENTO
  drawDecorativeBox(20, currentY, 170, 80, "EQUIPAMIENTO Y TESOROS");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ARMAS:", 25, currentY + 15);
  doc.text("ARMADURA:", 100, currentY + 15);
  
  let equipY = currentY + 25;
  let armorY = currentY + 25;
  
  if (character.equipo.length > 0) {
    character.equipo.forEach((item, index) => {
      let nombre = item.nombre ?? item;
      let tipo = item.tipo ?? "";
      
      if (typeof item === "string") {
        const match = item.match?.(/$$(ARMA|ARMADURA|OBJETO)$$$/);
        if (match) {
          tipo = match[1];
          nombre = item.replace(/\s*$$(ARMA|ARMADURA|OBJETO)$$$/, "").trim();
        }
      }
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      if (tipo === "ARMA" && equipY < currentY + 60) {
        doc.text(`• ${nombre}`, 30, equipY);
        equipY += 7;
      } else if (tipo === "ARMADURA" && armorY < currentY + 60) {
        doc.text(`• ${nombre}`, 105, armorY);
        armorY += 7;
      }
    });
  }
  
  // Líneas adicionales para equipamiento
  for(let i = 0; i < 4; i++) {
    drawFillableLines(30, currentY + 35 + (i * 8), 60);
    drawFillableLines(105, currentY + 35 + (i * 8), 60);
  }
  
  // MONEDAS (espacio rellenable)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MONEDAS:", 25, currentY + 70);
  doc.text("ORO:", 70, currentY + 70);
  drawFillableLines(85, currentY + 72, 20);
  doc.text("PLATA:", 115, currentY + 70);
  drawFillableLines(135, currentY + 72, 20);
  doc.text("COBRE:", 165, currentY + 70);
  drawFillableLines(185, currentY + 72, 15);
  
  currentY += 90;
  
  // NOTAS Y TRASFONDO
  if (currentY < 250) {
    drawDecorativeBox(20, currentY, 170, 40, "NOTAS Y TRASFONDO");
    
    // Líneas para escribir notas
    for(let i = 0; i < 4; i++) {
      drawFillableLines(25, currentY + 15 + (i * 8), 160);
    }
  }
  
  // Pie de página decorativo
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  const footer = "Creado con Dragons & Dungeons Character Creator";
  const footerWidth = doc.getTextWidth(footer);
  doc.text(footer, (210 - footerWidth) / 2, 285);
  
  // Guardar el PDF
  doc.save(`${character.nombre}_HojaPersonaje_DnD.pdf`);
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
