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
  
  // Colores temáticos D&D
  const colors = {
    gold: [218, 165, 32],
    darkBrown: [101, 67, 33],
    parchment: [245, 235, 220],
    darkParchment: [235, 220, 195],
    redAccent: [139, 69, 19],
    deepGold: [184, 134, 11],
    shadow: [80, 50, 20],
    lightGold: [255, 215, 0]
  };
  
  // Función para crear fondo de pergamino elaborado
  function createParchmentBackground() {
    // Fondo base
    doc.setFillColor(...colors.parchment);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Efectos de envejecimiento con gradientes
    doc.setGState(new doc.GState({opacity: 0.15}));
    doc.setFillColor(...colors.darkParchment);
    
    // Manchas de envejecimiento más realistas
    const spots = [
      {x: 30, y: 40, size: 25}, {x: 160, y: 80, size: 20},
      {x: 50, y: 150, size: 30}, {x: 170, y: 200, size: 18},
      {x: 25, y: 250, size: 22}, {x: 180, y: 50, size: 15}
    ];
    
    spots.forEach(spot => {
      doc.ellipse(spot.x, spot.y, spot.size, spot.size * 0.7, 'F');
    });
    
    doc.setGState(new doc.GState({opacity: 1}));
  }
  
  // Función para dibujar bordes ornamentales elaborados
  function drawOrnamentalBorders() {
    // Borde exterior principal
    doc.setDrawColor(...colors.darkBrown);
    doc.setLineWidth(3);
    doc.rect(8, 8, 194, 281);
    
    // Borde interior decorativo
    doc.setLineWidth(1.5);
    doc.setDrawColor(...colors.gold);
    doc.rect(12, 12, 186, 273);
    
    // Borde más interno
    doc.setLineWidth(0.8);
    doc.setDrawColor(...colors.darkBrown);
    doc.rect(15, 15, 180, 267);
    
    // Esquinas ornamentales elaboradas
    const cornerSize = 20;
    
    // Esquinas doradas con sombra
    doc.setFillColor(...colors.shadow);
    // Sombras de esquinas
    doc.triangle(16, 16, 31, 16, 16, 31, 'F');
    doc.triangle(194, 16, 179, 16, 194, 31, 'F');
    doc.triangle(16, 281, 31, 281, 16, 266, 'F');
    doc.triangle(194, 281, 179, 281, 194, 266, 'F');
    
    // Esquinas principales doradas
    doc.setFillColor(...colors.gold);
    doc.triangle(15, 15, 30, 15, 15, 30, 'F');
    doc.triangle(195, 15, 180, 15, 195, 30, 'F');
    doc.triangle(15, 282, 30, 282, 15, 267, 'F');
    doc.triangle(195, 282, 180, 282, 195, 267, 'F');
    
    // Detalles ornamentales en esquinas
    doc.setDrawColor(...colors.deepGold);
    doc.setLineWidth(0.5);
    // Líneas decorativas en esquinas
    doc.line(15, 25, 25, 15);
    doc.line(185, 15, 195, 25);
    doc.line(15, 272, 25, 282);
    doc.line(185, 282, 195, 272);
  }
  
  // Función para crear cajas decorativas elaboradas
  function drawElaborateBox(x, y, width, height, title, style = 'normal') {
    // Sombra de la caja
    doc.setFillColor(...colors.shadow);
    doc.setGState(new doc.GState({opacity: 0.3}));
    doc.roundedRect(x + 1, y + 1, width, height, 4, 4, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Fondo de la caja con gradiente simulado
    if (style === 'highlight') {
      doc.setFillColor(...colors.lightGold);
    } else {
      doc.setFillColor(250, 245, 235);
    }
    doc.roundedRect(x, y, width, height, 4, 4, 'F');
    
    // Borde dorado de la caja
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(1.5);
    doc.roundedRect(x, y, width, height, 4, 4, 'S');
    
    // Borde interior sutil
    doc.setDrawColor(...colors.deepGold);
    doc.setLineWidth(0.5);
    doc.roundedRect(x + 2, y + 2, width - 4, height - 4, 2, 2, 'S');
    
    // Título elaborado
    if (title) {
      const titleWidth = doc.getTextWidth(title) + 12;
      
      // Fondo del título con sombra
      doc.setFillColor(...colors.shadow);
      doc.setGState(new doc.GState({opacity: 0.4}));
      doc.roundedRect(x + 8, y - 6, titleWidth, 12, 3, 3, 'F');
      doc.setGState(new doc.GState({opacity: 1}));
      
      // Fondo del título
      doc.setFillColor(...colors.gold);
      doc.roundedRect(x + 7, y - 7, titleWidth, 12, 3, 3, 'F');
      
      // Borde del título
      doc.setDrawColor(...colors.darkBrown);
      doc.setLineWidth(1);
      doc.roundedRect(x + 7, y - 7, titleWidth, 12, 3, 3, 'S');
      
      // Texto del título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(title, x + 13, y - 1);
    }
  }
  
  // Función para líneas rellenables estilizadas
  function drawStyledFillableLines(x, y, width, spacing = 7, count = 1, style = 'normal') {
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(style === 'bold' ? 0.8 : 0.5);
    
    for(let i = 0; i < count; i++) {
      const lineY = y + (i * spacing);
      doc.line(x, lineY, x + width, lineY);
      
      // Pequeños puntos decorativos al final de cada línea
      if (style === 'decorative') {
        doc.setFillColor(...colors.gold);
        doc.circle(x + width + 2, lineY, 0.8, 'F');
      }
    }
  }
  
  // Función para círculos de estadísticas ornamentales
  function drawOrnamentalStatCircle(x, y, value, label) {
    // Sombra del círculo
    doc.setFillColor(...colors.shadow);
    doc.setGState(new doc.GState({opacity: 0.4}));
    doc.circle(x + 1, y + 1, 12, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Círculo exterior dorado
    doc.setFillColor(...colors.gold);
    doc.circle(x, y, 12, 'F');
    
    // Círculo interior
    doc.setFillColor(255, 255, 255);
    doc.circle(x, y, 9, 'F');
    
    // Borde decorativo
    doc.setDrawColor(...colors.darkBrown);
    doc.setLineWidth(2);
    doc.circle(x, y, 12, 'S');
    doc.setLineWidth(1);
    doc.circle(x, y, 9, 'S');
    
    // Valor de la estadística
    doc.setTextColor(...colors.darkBrown);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const valueStr = value.toString();
    const textWidth = doc.getTextWidth(valueStr);
    doc.text(valueStr, x - textWidth/2, y + 2);
    
    // Etiqueta de la estadística
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.darkBrown);
    const labelWidth = doc.getTextWidth(label);
    doc.text(label, x - labelWidth/2, y + 18);
  }
  
  // Crear el fondo elaborado
  createParchmentBackground();
  drawOrnamentalBorders();
  
  // TÍTULO PRINCIPAL ORNAMENTAL
  const titleY = 32;
  
  // Sombra del título
  doc.setTextColor(...colors.shadow);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  const mainTitle = "HOJA DE PERSONAJE";
  const titleWidth = doc.getTextWidth(mainTitle);
  doc.text(mainTitle, (210 - titleWidth) / 2 + 1, titleY + 1);
  
  // Título principal
  doc.setTextColor(...colors.darkBrown);
  doc.text(mainTitle, (210 - titleWidth) / 2, titleY);
  
  // Líneas decorativas del título
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(2);
  const titleStart = (210 - titleWidth) / 2 - 10;
  const titleEnd = (210 + titleWidth) / 2 + 10;
  doc.line(titleStart, titleY + 5, titleEnd, titleY + 5);
  doc.line(titleStart, titleY - 8, titleEnd, titleY - 8);
  
  // Subtítulo ornamental
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...colors.gold);
  const subtitle = "~ Dragones y Mazmorras ~";
  const subtitleWidth = doc.getTextWidth(subtitle);
  doc.text(subtitle, (210 - subtitleWidth) / 2, titleY + 12);
  
  // SECCIÓN DE INFORMACIÓN BÁSICA CON IMAGEN
  let currentY = 50;
  drawElaborateBox(20, currentY, 170, 55, "INFORMACIÓN DEL PERSONAJE", 'highlight');
  
  // IMAGEN DEL PERSONAJE (lado izquierdo)
  const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
  const imgURL = `img/${imgName}`;
  
  try {
    const imgData = await getBase64ImageFromUrl(imgURL);
    
    // Marco decorativo para la imagen
    doc.setFillColor(...colors.gold);
    doc.roundedRect(25, currentY + 8, 42, 42, 3, 3, 'F');
    doc.setDrawColor(...colors.darkBrown);
    doc.setLineWidth(2);
    doc.roundedRect(25, currentY + 8, 42, 42, 3, 3, 'S');
    
    // Imagen del personaje
    doc.addImage(imgData, "PNG", 27, currentY + 10, 38, 38);
    
    // Borde interior de la imagen
    doc.setDrawColor(...colors.deepGold);
    doc.setLineWidth(1);
    doc.roundedRect(27, currentY + 10, 38, 38, 2, 2, 'S');
    
  } catch (error) {
    // Si no se puede cargar la imagen, mostrar placeholder decorativo
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(27, currentY + 10, 38, 38, 2, 2, 'F');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("RETRATO", 46, currentY + 25);
    doc.text("PERSONAJE", 46, currentY + 33);
  }
  
  // INFORMACIÓN BÁSICA (lado derecho)
  const infoStartX = 75;
  
  // Nombre del personaje
  doc.setTextColor(...colors.darkBrown);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("NOMBRE:", infoStartX, currentY + 18);
  
  doc.setFontSize(14);
  doc.setTextColor(...colors.redAccent);
  doc.text(character.nombre, infoStartX, currentY + 28);
  drawStyledFillableLines(infoStartX, currentY + 30, 100, 7, 1, 'decorative');
  
  // Raza y Clase en la misma línea
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.darkBrown);
  doc.text("RAZA:", infoStartX, currentY + 42);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.redAccent);
  doc.text(character.raza, infoStartX + 25, currentY + 42);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.darkBrown);
  doc.text("CLASE:", infoStartX + 70, currentY + 42);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.redAccent);
  doc.text(character.clase, infoStartX + 95, currentY + 42);
  
  // Líneas rellenables para raza y clase
  drawStyledFillableLines(infoStartX + 25, currentY + 44, 40);
  drawStyledFillableLines(infoStartX + 95, currentY + 44, 40);
  
  currentY += 65;
  
  // ESTADÍSTICAS PRINCIPALES CON CÍRCULOS ORNAMENTALES
  drawElaborateBox(20, currentY, 170, 45, "⚔ ATRIBUTOS PRINCIPALES ⚔");
  
  const stats = [
    { name: "FUERZA", value: character.fuerza },
    { name: "DESTREZA", value: character.destreza },
    { name: "RESISTENCIA", value: character.resistencia },
    { name: "MAGIA", value: character.magia }
  ];
  
  const statStartX = 45;
  const statSpacing = 35;
  
  stats.forEach((stat, index) => {
    const x = statStartX + (index * statSpacing);
    drawOrnamentalStatCircle(x, currentY + 25, stat.value, stat.name);
  });
  
  currentY += 55;
  
  // HECHIZOS Y EQUIPAMIENTO (dos columnas)
  const columnWidth = 82;
  
  // COLUMNA IZQUIERDA - HECHIZOS
  drawElaborateBox(20, currentY, columnWidth, 70, "✨ HECHIZOS CONOCIDOS");
  
  let spellY = currentY + 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.darkBrown);
  
  if (character.hechizos.length > 0) {
    character.hechizos.forEach((spell, index) => {
      if (index < 4 && spellY < currentY + 60) {
        doc.text(`• ${spell}`, 25, spellY);
        spellY += 8;
      }
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("Ningún hechizo conocido", 25, spellY);
    spellY += 8;
  }
  
  // Líneas adicionales para hechizos
  const remainingSpellLines = Math.max(0, 4 - character.hechizos.length);
  drawStyledFillableLines(25, spellY, 70, 8, remainingSpellLines);
  
  // COLUMNA DERECHA - EQUIPAMIENTO
  drawElaborateBox(108, currentY, columnWidth, 70, "⚔ EQUIPAMIENTO");
  
  let equipY = currentY + 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.darkBrown);
  
  if (character.equipo.length > 0) {
    character.equipo.forEach((item, index) => {
      if (index < 4 && equipY < currentY + 60) {
        let nombre = item.nombre ?? item;
        let tipo = item.tipo ?? "";
        
        if (typeof item === "string") {
          const match = item.match?.(/$$(ARMA|ARMADURA|OBJETO)$$$/);
          if (match) {
            tipo = match[1];
            nombre = item.replace(/\s*$$(ARMA|ARMADURA|OBJETO)$$$/, "").trim();
          }
        }
        
        doc.text(`• ${nombre}`, 113, equipY);
        if (tipo) {
          doc.setFontSize(8);
          doc.setTextColor(...colors.gold);
          doc.text(`(${tipo})`, 113 + doc.getTextWidth(`• ${nombre} `), equipY);
          doc.setFontSize(10);
          doc.setTextColor(...colors.darkBrown);
        }
        equipY += 8;
      }
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("Sin equipamiento", 113, equipY);
    equipY += 8;
  }
  
  // Líneas adicionales para equipamiento
  const remainingEquipLines = Math.max(0, 4 - character.equipo.length);
  drawStyledFillableLines(113, equipY, 70, 8, remainingEquipLines);
  
  currentY += 80;
  
  // ESTADÍSTICAS SECUNDARIAS
  drawElaborateBox(20, currentY, 170, 50, "📊 ESTADÍSTICAS DE COMBATE");
  
  const combatStats = [
    { label: "PUNTOS DE VIDA MÁXIMOS:", x: 25, y: currentY + 15 },
    { label: "PUNTOS DE VIDA ACTUALES:", x: 25, y: currentY + 25 },
    { label: "CLASE DE ARMADURA:", x: 25, y: currentY + 35 },
    { label: "VELOCIDAD:", x: 25, y: currentY + 45 },
    { label: "INICIATIVA:", x: 120, y: currentY + 15 },
    { label: "COMPETENCIA:", x: 120, y: currentY + 25 },
    { label: "NIVEL:", x: 120, y: currentY + 35 },
    { label: "EXPERIENCIA:", x: 120, y: currentY + 45 }
  ];
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.darkBrown);
  
  combatStats.forEach(stat => {
    doc.text(stat.label, stat.x, stat.y);
    const lineStart = stat.x + doc.getTextWidth(stat.label) + 3;
    const lineEnd = stat.x < 100 ? 110 : 185;
    drawStyledFillableLines(lineStart, stat.y + 1, lineEnd - lineStart);
  });
  
  currentY += 60;
  
  // NOTAS Y TRASFONDO
  if (currentY < 240) {
    drawElaborateBox(20, currentY, 170, 45, "📜 TRASFONDO Y NOTAS DEL PERSONAJE");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...colors.darkBrown);
    doc.text("Escribe aquí la historia y personalidad de tu personaje:", 25, currentY + 15);
    
    // Líneas decorativas para escribir
    drawStyledFillableLines(25, currentY + 22, 160, 8, 3, 'decorative');
  }
  
  // PIE DE PÁGINA ORNAMENTAL
  const footerY = 275;
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(1);
  doc.line(30, footerY, 180, footerY);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...colors.gold);
  const footer = "~ Creado con Dragons & Dungeons Character Creator ~";
  const footerWidth = doc.getTextWidth(footer);
  doc.text(footer, (210 - footerWidth) / 2, footerY + 8);
  
  // Guardar el PDF con nombre descriptivo
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
