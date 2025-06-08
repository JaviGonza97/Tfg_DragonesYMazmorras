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

// Función completa para exportar PDF de múltiples páginas con diseño auténtico de D&D
async function exportPDF(character) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");
  
  // Colores en tonos sepia/marrón para un aspecto auténtico de D&D
  const colors = {
    sepia: [112, 66, 20],        // Marrón sepia principal
    lightSepia: [222, 208, 191], // Fondo pergamino claro
    darkSepia: [92, 46, 0],      // Marrón oscuro para detalles
    gold: [181, 136, 99],        // Dorado antiguo
    accent: [143, 89, 34]        // Acento marrón rojizo
  };
  
  // Función para crear fondo de pergamino con patrón sutil
  function createParchmentBackground() {
    doc.setFillColor(...colors.lightSepia);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Patrón sutil de textura
    doc.setGState(new doc.GState({opacity: 0.05}));
    doc.setFillColor(...colors.sepia);
    
    for(let x = 0; x < 210; x += 4) {
      for(let y = 0; y < 297; y += 4) {
        if(Math.random() > 0.7) {
          doc.circle(x, y, 0.2, 'F');
        }
      }
    }
    
    doc.setGState(new doc.GState({opacity: 1}));
  }
  
  // Función para dibujar marcos decorativos estilo D&D
  function drawDecorativeFrame(x, y, width, height, title = null, titleColor = colors.sepia) {
    // Marco principal
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1.2);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');
    
    // Marco interior
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.5);
    doc.roundedRect(x + 2, y + 2, width - 4, height - 4, 2, 2, 'S');
    
    // Título si existe
    if (title) {
      doc.setFontSize(10);
      doc.setFont("times", "bold");
      const titleWidth = doc.getTextWidth(title);
      
      // Fondo del título
      doc.setFillColor(...colors.lightSepia);
      doc.roundedRect(x + (width - titleWidth) / 2 - 5, y - 6, titleWidth + 10, 12, 3, 3, 'F');
      
      // Borde del título
      doc.setDrawColor(...titleColor);
      doc.setLineWidth(1);
      doc.roundedRect(x + (width - titleWidth) / 2 - 5, y - 6, titleWidth + 10, 12, 3, 3, 'S');
      
      // Texto del título
      doc.setTextColor(...titleColor);
      doc.text(title, x + (width - titleWidth) / 2, y + 1);
    }
  }
  
  // Función para dibujar líneas punteadas para rellenar
  function drawDottedLine(x, y, width, label = null, labelWidth = 0) {
    if (label) {
      doc.setTextColor(...colors.sepia);
      doc.setFontSize(9);
      doc.setFont("times", "bold");
      doc.text(label, x, y);
      x += labelWidth || (doc.getTextWidth(label) + 3);
      width -= labelWidth || (doc.getTextWidth(label) + 3);
    }
    
    // Línea punteada
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.4);
    
    const dotSpacing = 1.2;
    const dotCount = Math.floor(width / dotSpacing);
    
    for (let i = 0; i < dotCount; i++) {
      const dotX = x + (i * dotSpacing);
      doc.line(dotX, y, dotX + 0.4, y);
    }
    
    // Puntos decorativos en los extremos
    doc.setFillColor(...colors.gold);
    doc.circle(x - 1, y, 0.8, 'F');
    doc.circle(x + width + 1, y, 0.8, 'F');
  }
  
  // Función para dibujar círculos de estadísticas estilo D&D
  function drawStatCircle(x, y, statName, statValue, modifier) {
    // Marco exterior decorativo
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1.5);
    doc.circle(x, y, 15, 'S');
    
    // Círculo interior
    doc.setFillColor(255, 255, 255);
    doc.circle(x, y, 12, 'F');
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.8);
    doc.circle(x, y, 12, 'S');
    
    // Valor de la estadística
    doc.setTextColor(...colors.sepia);
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    const valueWidth = doc.getTextWidth(statValue.toString());
    doc.text(statValue.toString(), x - valueWidth/2, y + 3);
    
    // Modificador
    const mod = Math.floor((statValue - 10) / 2);
    const modText = mod >= 0 ? `+${mod}` : `${mod}`;
    doc.setFontSize(10);
    const modWidth = doc.getTextWidth(modText);
    doc.text(modText, x - modWidth/2, y - 8);
    
    // Nombre de la estadística
    doc.setFontSize(8);
    doc.setFont("times", "bold");
    const nameWidth = doc.getTextWidth(statName);
    doc.text(statName, x - nameWidth/2, y + 22);
  }
  
  // Función para crear encabezado de página con nombre del personaje
  function createPageHeader(pageNum) {
    // Banner superior
    doc.setFillColor(...colors.lightSepia);
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1.5);
    doc.roundedRect(15, 10, 180, 25, 3, 3, 'FD');
    
    // Nombre del personaje en el encabezado
    doc.setTextColor(...colors.sepia);
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text(character.nombre, 25, 27);
    
    // Número de página
    doc.setFontSize(12);
    doc.text(`Página ${pageNum}`, 170, 27);
    
    // Línea decorativa
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(2);
    doc.line(15, 38, 195, 38);
  }
  
  // ==================== PÁGINA 1: INFORMACIÓN PRINCIPAL ====================
  createParchmentBackground();
  createPageHeader(1);
  
  let currentY = 50;
  
  // TÍTULO DEL PERSONAJE
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(24);
  doc.setFont("times", "bold");
  const nameText = character.nombre.toUpperCase();
  const nameWidth = doc.getTextWidth(nameText);
  doc.text(nameText, (210 - nameWidth) / 2, currentY);
  
  // Línea decorativa bajo el nombre
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(2);
  doc.line(50, currentY + 5, 160, currentY + 5);
  
  currentY += 20;
  
  // SECCIÓN DE INFORMACIÓN BÁSICA CON IMAGEN (reducida)
  drawDecorativeFrame(20, currentY, 170, 70, "INFORMACIÓN DEL PERSONAJE");
  
  // Imagen del personaje (cuadrada y recortada desde arriba)
  const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
  const imgURL = `img/${imgName}`;
  
  try {
    const imgData = await getBase64ImageFromUrl(imgURL);
    
    // Marco decorativo para la imagen (cuadrado perfecto)
    const imgSize = 45;
    doc.setFillColor(...colors.gold);
    doc.roundedRect(25, currentY + 10, imgSize, imgSize, 3, 3, 'F');
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(2);
    doc.roundedRect(25, currentY + 10, imgSize, imgSize, 3, 3, 'S');
    
    // Imagen del personaje (cuadrada, recortada desde arriba)
    const imgInnerSize = imgSize - 4;
    doc.addImage(imgData, "PNG", 27, currentY + 12, imgInnerSize, imgInnerSize, undefined, 'FAST', 0, 0, imgInnerSize, imgInnerSize);
    
    // Marco interior de la imagen
    doc.setDrawColor(...colors.darkSepia);
    doc.setLineWidth(1);
    doc.roundedRect(27, currentY + 12, imgInnerSize, imgInnerSize, 2, 2, 'S');
    
  } catch (error) {
    // Placeholder si no se puede cargar la imagen
    const imgSize = 45;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(27, currentY + 12, imgSize - 4, imgSize - 4, 2, 2, 'F');
    doc.setTextColor(...colors.sepia);
    doc.setFontSize(9);
    doc.text("RETRATO", 50, currentY + 28);
    doc.text("PERSONAJE", 50, currentY + 36);
  }
  
  // Información básica del personaje
  const infoX = 80;
  
  // Campos de información básica
  drawDottedLine(infoX, currentY + 18, 90, "CLASE Y NIVEL:", 35);
  doc.setTextColor(...colors.darkSepia);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(character.clase, infoX + 35, currentY + 18);
  
  drawDottedLine(infoX, currentY + 28, 90, "RAZA:", 20);
  doc.text(character.raza, infoX + 20, currentY + 28);
  
  drawDottedLine(infoX, currentY + 38, 90, "TRASFONDO:", 35);
  drawDottedLine(infoX, currentY + 48, 90, "ALINEAMIENTO:", 40);
  drawDottedLine(infoX, currentY + 58, 90, "EXPERIENCIA:", 35);
  
  currentY += 80;
  
  // ATRIBUTOS PRINCIPALES (reducido)
  drawDecorativeFrame(20, currentY, 170, 60, "ATRIBUTOS PRINCIPALES");
  
  const stats = [
    { name: "FUERZA", value: character.fuerza },
    { name: "DESTREZA", value: character.destreza },
    { name: "RESISTENCIA", value: character.resistencia },
    { name: "MAGIA", value: character.magia }
  ];
  
  // Dibujar círculos de estadísticas
  const statY = currentY + 35;
  stats.forEach((stat, index) => {
    const x = 50 + (index * 35);
    drawStatCircle(x, statY, stat.name, stat.value);
  });
  
  currentY += 70;
  
  // TIRADAS DE SALVACIÓN Y HABILIDADES (reducido)
  drawDecorativeFrame(20, currentY, 80, 50, "TIRADAS DE SALVACIÓN");
  
  const savingThrows = ["Fuerza", "Destreza", "Constitución", "Inteligencia"];
  savingThrows.forEach((save, index) => {
    const y = currentY + 12 + (index * 9);
    doc.setFillColor(...colors.sepia);
    doc.rect(25, y - 2, 4, 4, 'F');
    drawDottedLine(35, y, 35, save + ":", 25);
  });
  
  // HABILIDADES
  drawDecorativeFrame(110, currentY, 80, 50, "HABILIDADES");
  
  const skills = ["Acrobacias", "Atletismo", "Engaño", "Historia"];
  skills.forEach((skill, index) => {
    const y = currentY + 12 + (index * 9);
    doc.setFillColor(...colors.sepia);
    doc.rect(115, y - 2, 4, 4, 'F');
    drawDottedLine(125, y, 35, skill + ":", 25);
  });
  
  // ==================== PÁGINA 2: COMBATE Y EQUIPAMIENTO ====================
  doc.addPage();
  createParchmentBackground();
  createPageHeader(2);
  
  currentY = 50;
  
  // ESTADÍSTICAS DE COMBATE
  drawDecorativeFrame(20, currentY, 170, 60, "ESTADÍSTICAS DE COMBATE");
  
  // Puntos de vida
  drawDecorativeFrame(30, currentY + 12, 70, 40, "PUNTOS DE VIDA");
  drawDottedLine(35, currentY + 24, 50, "Máximo:", 25);
  drawDottedLine(35, currentY + 32, 50, "Actual:", 25);
  drawDottedLine(35, currentY + 40, 50, "Temporal:", 25);
  
  // Clase de armadura e iniciativa
  drawDecorativeFrame(110, currentY + 12, 70, 40, "COMBATE");
  drawDottedLine(115, currentY + 24, 50, "Clase de Armadura:", 45);
  drawDottedLine(115, currentY + 32, 50, "Iniciativa:", 25);
  drawDottedLine(115, currentY + 40, 50, "Velocidad:", 25);
  
  currentY += 70;
  
  // ATAQUES Y CONJUROS
  drawDecorativeFrame(20, currentY, 170, 50, "ATAQUES Y CONJUROS");
  
  // Encabezados de tabla
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  doc.text("NOMBRE", 30, currentY + 12);
  doc.text("BONIF. ATAQUE", 80, currentY + 12);
  doc.text("DAÑO/TIPO", 130, currentY + 12);
  
  // Líneas para ataques
  for (let i = 0; i < 3; i++) {
    const y = currentY + 20 + (i * 9);
    drawDottedLine(30, y, 40);
    drawDottedLine(80, y, 35);
    drawDottedLine(130, y, 50);
  }
  
  currentY += 60;
  
  // EQUIPAMIENTO
  drawDecorativeFrame(20, currentY, 170, 80, "EQUIPAMIENTO");
  
  // Mostrar equipamiento actual
  let equipY = currentY + 12;
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("EQUIPAMIENTO ACTUAL:", 30, equipY);
  
  equipY += 10;
  if (character.equipo.length > 0) {
    character.equipo.forEach((item, index) => {
      if (index < 6 && equipY < currentY + 70) {
        let nombre = item.nombre ?? item;
        let tipo = item.tipo ?? "";
        
        if (typeof item === "string") {
          const match = item.match?.(/$$(ARMA|ARMADURA|OBJETO)$$$/);
          if (match) {
            tipo = match[1];
            nombre = item.replace(/\s*$$(ARMA|ARMADURA|OBJETO)$$$/, "").trim();
          }
        }
        
        doc.setFillColor(...colors.sepia);
        doc.circle(35, equipY, 1, 'F');
        
        doc.setTextColor(...colors.sepia);
        doc.setFontSize(9);
        doc.setFont("times", "normal");
        doc.text(nombre, 40, equipY);
        
        if (tipo) {
          doc.setFontSize(8);
          doc.setFont("times", "italic");
          doc.text(`(${tipo})`, 40 + doc.getTextWidth(nombre + " "), equipY);
        }
        
        equipY += 8;
      }
    });
  }
  
  // Líneas adicionales para equipamiento
  const remainingLines = Math.max(0, 6 - character.equipo.length);
  for (let i = 0; i < remainingLines; i++) {
    if (equipY + (i * 8) < currentY + 70) {
      drawDottedLine(40, equipY + (i * 8), 130);
    }
  }
  
  currentY += 90;
  
  // OTRAS COMPETENCIAS (ajustado para que quepa)
  if (currentY < 240) {
    drawDecorativeFrame(20, currentY, 170, 40, "OTRAS COMPETENCIAS Y IDIOMAS");
    
    // Líneas para competencias adicionales
    for (let i = 0; i < 3; i++) {
      drawDottedLine(30, currentY + 12 + (i * 8), 150);
    }
  }
  
  // ==================== PÁGINA 3: HECHIZOS Y TRASFONDO ====================
  doc.addPage();
  createParchmentBackground();
  createPageHeader(3);
  
  currentY = 50;
  
  // HECHIZOS
  drawDecorativeFrame(20, currentY, 170, 80, "GRIMORIO DE HECHIZOS");
  
  // Información de conjuros
  drawDottedLine(30, currentY + 12, 50, "Clase de conjuro:", 40);
  drawDottedLine(100, currentY + 12, 70, "Habilidad de conjuro:", 45);
  drawDottedLine(30, currentY + 22, 50, "CD de conjuro:", 35);
  drawDottedLine(100, currentY + 22, 70, "Bonif. de ataque:", 40);
  
  // Hechizos conocidos
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("HECHIZOS CONOCIDOS:", 30, currentY + 35);
  
  let spellY = currentY + 45;
  if (character.hechizos.length > 0) {
    character.hechizos.forEach((spell, index) => {
      if (spellY < currentY + 70) {
        doc.setFillColor(...colors.sepia);
        doc.circle(35, spellY, 1, 'F');
        
        doc.setTextColor(...colors.sepia);
        doc.setFontSize(9);
        doc.setFont("times", "normal");
        doc.text(spell, 40, spellY);
        
        spellY += 8;
      }
    });
  }
  
  // Líneas adicionales para hechizos
  const remainingSpellLines = Math.floor((currentY + 70 - spellY) / 8);
  for (let i = 0; i < remainingSpellLines; i++) {
    drawDottedLine(40, spellY + (i * 8), 130);
  }
  
  currentY += 90;
  
  // ALIADOS Y ENEMIGOS
  drawDecorativeFrame(20, currentY, 80, 50, "ALIADOS");
  drawDecorativeFrame(110, currentY, 80, 50, "ENEMIGOS");
  
  // Líneas para aliados
  for (let i = 0; i < 4; i++) {
    drawDottedLine(25, currentY + 12 + (i * 8), 70);
  }
  
  // Líneas para enemigos
  for (let i = 0; i < 4; i++) {
    drawDottedLine(115, currentY + 12 + (i * 8), 70);
  }
  
  currentY += 60;
  
  // TESOROS Y RIQUEZAS
  drawDecorativeFrame(20, currentY, 170, 50, "TESOROS Y RIQUEZAS");
  
  // Monedas
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  doc.text("MONEDAS DE ORO:", 30, currentY + 15);
  doc.text("MONEDAS DE PLATA:", 80, currentY + 15);
  doc.text("MONEDAS DE COBRE:", 130, currentY + 15);
  
  drawDottedLine(30, currentY + 25, 35);
  drawDottedLine(80, currentY + 25, 35);
  drawDottedLine(130, currentY + 25, 35);
  
  // Objetos valiosos
  doc.text("OBJETOS VALIOSOS:", 30, currentY + 35);
  drawDottedLine(30, currentY + 42, 150);
  
  // Pie de página
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(10);
  doc.setFont("times", "italic");
  const footer = "¡Que tus aventuras sean épicas y tus dados siempre favorables!";
  const footerWidth = doc.getTextWidth(footer);
  doc.text(footer, (210 - footerWidth) / 2, 280);
  
  // Guardar el PDF
  doc.save(`${character.nombre}_HojaCompleta_DnD.pdf`);
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
