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

// Función mejorada para exportar PDF de múltiples páginas con diseño D&D
async function exportPDF(character) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");
  
  // Paleta de colores más bonita y vibrante
  const colors = {
    deepPurple: [75, 0, 130],        // Púrpura profundo
    royalGold: [255, 215, 0],        // Oro real
    crimsonRed: [220, 20, 60],       // Rojo carmesí
    forestGreen: [34, 139, 34],      // Verde bosque
    parchment: [255, 248, 220],      // Pergamino claro
    darkParchment: [245, 222, 179],  // Pergamino oscuro
    silverBlue: [176, 196, 222],     // Azul plateado
    burnishedGold: [184, 134, 11],   // Oro bruñido
    shadow: [47, 79, 79],            // Sombra oscura
    ivory: [255, 255, 240],          // Marfil
    emerald: [80, 200, 120],         // Esmeralda
    sapphire: [65, 105, 225]         // Zafiro
  };
  
  let currentPage = 1;
  
  // Función para crear encabezado de página
  function createPageHeader(pageTitle, pageNumber) {
    // Fondo degradado del encabezado
    doc.setFillColor(...colors.deepPurple);
    doc.rect(0, 0, 210, 25, 'F');
    
    // Línea dorada decorativa
    doc.setDrawColor(...colors.royalGold);
    doc.setLineWidth(2);
    doc.line(0, 25, 210, 25);
    
    // Título de la página
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(pageTitle, 20, 17);
    
    // Número de página
    doc.setFontSize(12);
    doc.text(`Página ${pageNumber}`, 170, 17);
    
    // Decoración lateral
    doc.setFillColor(...colors.royalGold);
    doc.circle(15, 12.5, 3, 'F');
    doc.circle(195, 12.5, 3, 'F');
  }
  
  // Función para crear fondo de pergamino mejorado
  function createEnhancedParchmentBackground() {
    // Fondo base
    doc.setFillColor(...colors.parchment);
    doc.rect(0, 25, 210, 272, 'F');
    
    // Efectos de textura
    doc.setGState(new doc.GState({opacity: 0.1}));
    doc.setFillColor(...colors.darkParchment);
    
    // Patrones de textura más sofisticados
    for(let i = 0; i < 20; i++) {
      const x = Math.random() * 200 + 5;
      const y = Math.random() * 250 + 30;
      const size = Math.random() * 15 + 5;
      doc.ellipse(x, y, size, size * 0.6, 'F');
    }
    
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Bordes laterales decorativos
    doc.setDrawColor(...colors.burnishedGold);
    doc.setLineWidth(1);
    doc.line(10, 30, 10, 290);
    doc.line(200, 30, 200, 290);
  }
  
  // Función para cajas más elegantes
  function createElegantBox(x, y, width, height, title, color = colors.sapphire) {
    // Sombra suave
    doc.setFillColor(...colors.shadow);
    doc.setGState(new doc.GState({opacity: 0.2}));
    doc.roundedRect(x + 2, y + 2, width, height, 5, 5, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Fondo principal
    doc.setFillColor(...colors.ivory);
    doc.roundedRect(x, y, width, height, 5, 5, 'F');
    
    // Borde colorido
    doc.setDrawColor(...color);
    doc.setLineWidth(2);
    doc.roundedRect(x, y, width, height, 5, 5, 'S');
    
    // Borde interior sutil
    doc.setDrawColor(...colors.silverBlue);
    doc.setLineWidth(0.5);
    doc.roundedRect(x + 3, y + 3, width - 6, height - 6, 3, 3, 'S');
    
    // Título elegante
    if (title) {
      const titleWidth = doc.getTextWidth(title) + 16;
      
      // Fondo del título
      doc.setFillColor(...color);
      doc.roundedRect(x + 10, y - 8, titleWidth, 16, 4, 4, 'F');
      
      // Borde del título
      doc.setDrawColor(...colors.shadow);
      doc.setLineWidth(1);
      doc.roundedRect(x + 10, y - 8, titleWidth, 16, 4, 4, 'S');
      
      // Texto del título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, x + 18, y + 2);
    }
  }
  
  // Función para líneas elegantes
  function createElegantLines(x, y, width, count = 1, spacing = 8, color = colors.silverBlue) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);
    
    for(let i = 0; i < count; i++) {
      const lineY = y + (i * spacing);
      doc.line(x, lineY, x + width, lineY);
      
      // Puntos decorativos
      doc.setFillColor(...colors.royalGold);
      doc.circle(x - 2, lineY, 1, 'F');
      doc.circle(x + width + 2, lineY, 1, 'F');
    }
  }
  
  // Función para círculos de estadísticas mejorados
  function createBeautifulStatCircle(x, y, value, label, color = colors.emerald) {
    // Sombra del círculo
    doc.setFillColor(...colors.shadow);
    doc.setGState(new doc.GState({opacity: 0.3}));
    doc.circle(x + 2, y + 2, 15, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Círculo exterior
    doc.setFillColor(...color);
    doc.circle(x, y, 15, 'F');
    
    // Círculo medio
    doc.setFillColor(...colors.ivory);
    doc.circle(x, y, 12, 'F');
    
    // Círculo interior
    doc.setFillColor(...color);
    doc.circle(x, y, 9, 'F');
    
    // Bordes decorativos
    doc.setDrawColor(...colors.shadow);
    doc.setLineWidth(2);
    doc.circle(x, y, 15, 'S');
    doc.setLineWidth(1);
    doc.circle(x, y, 12, 'S');
    
    // Valor
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const valueStr = value.toString();
    const textWidth = doc.getTextWidth(valueStr);
    doc.text(valueStr, x - textWidth/2, y + 3);
    
    // Etiqueta
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.shadow);
    const labelWidth = doc.getTextWidth(label);
    doc.text(label, x - labelWidth/2, y + 25);
  }
  
  // ==================== PÁGINA 1: INFORMACIÓN PRINCIPAL ====================
  createPageHeader("HOJA DE PERSONAJE - INFORMACIÓN PRINCIPAL", 1);
  createEnhancedParchmentBackground();
  
  let currentY = 40;
  
  // TÍTULO PRINCIPAL ESPECTACULAR
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const mainTitle = character.nombre.toUpperCase();
  const titleWidth = doc.getTextWidth(mainTitle);
  doc.text(mainTitle, (210 - titleWidth) / 2, currentY);
  
  // Líneas decorativas del título
  doc.setDrawColor(...colors.royalGold);
  doc.setLineWidth(3);
  doc.line(30, currentY + 5, 180, currentY + 5);
  doc.line(50, currentY - 10, 160, currentY - 10);
  
  currentY += 25;
  
  // INFORMACIÓN BÁSICA CON IMAGEN (más espaciosa)
  createElegantBox(20, currentY, 170, 80, "INFORMACIÓN DEL AVENTURERO", colors.crimsonRed);
  
  // Imagen del personaje (más grande)
  const imgName = `${character.raza.toLowerCase()}_${character.clase.toLowerCase()}.png`;
  const imgURL = `img/${imgName}`;
  
  try {
    const imgData = await getBase64ImageFromUrl(imgURL);
    
    // Marco decorativo para la imagen
    doc.setFillColor(...colors.royalGold);
    doc.roundedRect(30, currentY + 15, 60, 60, 5, 5, 'F');
    doc.setDrawColor(...colors.deepPurple);
    doc.setLineWidth(3);
    doc.roundedRect(30, currentY + 15, 60, 60, 5, 5, 'S');
    
    // Imagen
    doc.addImage(imgData, "PNG", 33, currentY + 18, 54, 54);
    
  } catch (error) {
    // Placeholder elegante
    doc.setFillColor(...colors.silverBlue);
    doc.roundedRect(33, currentY + 18, 54, 54, 3, 3, 'F');
    doc.setTextColor(...colors.shadow);
    doc.setFontSize(12);
    doc.text("RETRATO", 60, currentY + 40);
    doc.text("PERSONAJE", 60, currentY + 50);
  }
  
  // Información básica (lado derecho, más espaciosa)
  const infoX = 100;
  
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RAZA:", infoX, currentY + 25);
  doc.setTextColor(...colors.crimsonRed);
  doc.setFontSize(16);
  doc.text(character.raza, infoX + 30, currentY + 25);
  
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(14);
  doc.text("CLASE:", infoX, currentY + 40);
  doc.setTextColor(...colors.crimsonRed);
  doc.setFontSize(16);
  doc.text(character.clase, infoX + 30, currentY + 40);
  
  // Campos adicionales con líneas elegantes
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(12);
  doc.text("NIVEL:", infoX, currentY + 55);
  createElegantLines(infoX + 30, currentY + 57, 50, 1);
  
  doc.text("TRASFONDO:", infoX, currentY + 70);
  createElegantLines(infoX + 45, currentY + 72, 35, 1);
  
  currentY += 90;
  
  // ATRIBUTOS PRINCIPALES (más espaciosos y coloridos)
  createElegantBox(20, currentY, 170, 80, "⚔ ATRIBUTOS PRINCIPALES ⚔", colors.forestGreen);
  
  const stats = [
    { name: "FUERZA", value: character.fuerza, color: colors.crimsonRed },
    { name: "DESTREZA", value: character.destreza, color: colors.emerald },
    { name: "RESISTENCIA", value: character.resistencia, color: colors.sapphire },
    { name: "MAGIA", value: character.magia, color: colors.deepPurple }
  ];
  
  const statY = currentY + 45;
  stats.forEach((stat, index) => {
    const x = 50 + (index * 40);
    createBeautifulStatCircle(x, statY, stat.value, stat.name, stat.color);
    
    // Modificador
    doc.setTextColor(...colors.shadow);
    doc.setFontSize(10);
    doc.text("MOD:", x - 10, statY + 35);
    createElegantLines(x + 5, statY + 37, 15, 1);
  });
  
  currentY += 90;
  
  // ESTADÍSTICAS SECUNDARIAS (más organizadas)
  createElegantBox(20, currentY, 170, 60, "📊 ESTADÍSTICAS DE COMBATE", colors.sapphire);
  
  const combatStats = [
    { label: "PUNTOS DE VIDA MÁXIMOS", x: 30, y: currentY + 20 },
    { label: "PUNTOS DE VIDA ACTUALES", x: 30, y: currentY + 35 },
    { label: "PUNTOS DE VIDA TEMPORALES", x: 30, y: currentY + 50 },
    { label: "CLASE DE ARMADURA", x: 120, y: currentY + 20 },
    { label: "INICIATIVA", x: 120, y: currentY + 35 },
    { label: "VELOCIDAD", x: 120, y: currentY + 50 }
  ];
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.deepPurple);
  
  combatStats.forEach(stat => {
    doc.text(stat.label + ":", stat.x, stat.y);
    createElegantLines(stat.x + 60, stat.y + 2, 25, 1);
  });
  
  // ==================== PÁGINA 2: HABILIDADES Y EQUIPAMIENTO ====================
  doc.addPage();
  currentPage = 2;
  createPageHeader("HABILIDADES, HECHIZOS Y EQUIPAMIENTO", 2);
  createEnhancedParchmentBackground();
  
  currentY = 40;
  
  // HECHIZOS (sección completa más espaciosa)
  createElegantBox(20, currentY, 170, 100, "✨ GRIMORIO DE HECHIZOS ✨", colors.deepPurple);
  
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("HECHIZOS CONOCIDOS:", 30, currentY + 20);
  
  let spellY = currentY + 35;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  if (character.hechizos.length > 0) {
    character.hechizos.forEach((spell, index) => {
      if (spellY < currentY + 85) {
        // Viñeta decorativa
        doc.setFillColor(...colors.royalGold);
        doc.circle(35, spellY - 2, 2, 'F');
        
        doc.setTextColor(...colors.shadow);
        doc.text(spell, 45, spellY);
        spellY += 12;
      }
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...colors.silverBlue);
    doc.text("Este aventurero aún no ha aprendido ningún hechizo", 45, spellY);
  }
  
  // Espacios adicionales para hechizos
  const remainingSpellSpace = Math.floor((currentY + 85 - spellY) / 12);
  if (remainingSpellSpace > 0) {
    createElegantLines(45, spellY + 5, 130, remainingSpellSpace, 12);
  }
  
  currentY += 110;
  
  // EQUIPAMIENTO (sección expandida)
  createElegantBox(20, currentY, 170, 120, "⚔ ARSENAL Y EQUIPAMIENTO ⚔", colors.crimsonRed);
  
  // Categorías de equipamiento
  const equipCategories = {
    ARMA: { title: "ARMAS", x: 30, items: [] },
    ARMADURA: { title: "ARMADURAS", x: 110, items: [] },
    OBJETO: { title: "OBJETOS", x: 30, items: [] }
  };
  
  // Clasificar equipamiento
  character.equipo.forEach(item => {
    let nombre = item.nombre ?? item;
    let tipo = item.tipo ?? "OBJETO";
    
    if (typeof item === "string") {
      const match = item.match?.(/$$(ARMA|ARMADURA|OBJETO)$$$/);
      if (match) {
        tipo = match[1];
        nombre = item.replace(/\s*$$(ARMA|ARMADURA|OBJETO)$$$/, "").trim();
      }
    }
    
    if (equipCategories[tipo]) {
      equipCategories[tipo].items.push(nombre);
    }
  });
  
  // Mostrar armas
  doc.setTextColor(...colors.crimsonRed);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ARMAS:", 30, currentY + 20);
  
  let weaponY = currentY + 35;
  equipCategories.ARMA.items.forEach(weapon => {
    if (weaponY < currentY + 70) {
      doc.setFillColor(...colors.crimsonRed);
      doc.circle(35, weaponY - 2, 2, 'F');
      doc.setTextColor(...colors.shadow);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(weapon, 45, weaponY);
      weaponY += 10;
    }
  });
  
  // Líneas para armas adicionales
  createElegantLines(45, weaponY + 5, 60, 3, 10);
  
  // Mostrar armaduras
  doc.setTextColor(...colors.sapphire);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ARMADURAS:", 110, currentY + 20);
  
  let armorY = currentY + 35;
  equipCategories.ARMADURA.items.forEach(armor => {
    if (armorY < currentY + 70) {
      doc.setFillColor(...colors.sapphire);
      doc.circle(115, armorY - 2, 2, 'F');
      doc.setTextColor(...colors.shadow);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(armor, 125, armorY);
      armorY += 10;
    }
  });
  
  // Líneas para armaduras adicionales
  createElegantLines(125, armorY + 5, 60, 3, 10);
  
  // Mostrar objetos
  doc.setTextColor(...colors.forestGreen);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("OBJETOS Y TESOROS:", 30, currentY + 80);
  
  let objectY = currentY + 95;
  equipCategories.OBJETO.items.forEach(object => {
    if (objectY < currentY + 115) {
      doc.setFillColor(...colors.forestGreen);
      doc.circle(35, objectY - 2, 2, 'F');
      doc.setTextColor(...colors.shadow);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(object, 45, objectY);
      objectY += 10;
    }
  });
  
  // Líneas para objetos adicionales
  createElegantLines(45, objectY + 5, 130, 2, 10);
  
  // ==================== PÁGINA 3: TRASFONDO Y NOTAS ====================
  doc.addPage();
  currentPage = 3;
  createPageHeader("TRASFONDO Y AVENTURAS", 3);
  createEnhancedParchmentBackground();
  
  currentY = 40;
  
  // TRASFONDO DEL PERSONAJE
  createElegantBox(20, currentY, 170, 80, "📜 HISTORIA DEL PERSONAJE", colors.forestGreen);
  
  doc.setTextColor(...colors.forestGreen);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text("Escribe aquí la historia, personalidad y motivaciones de tu personaje:", 30, currentY + 20);
  
  createElegantLines(30, currentY + 35, 150, 6, 8);
  
  currentY += 90;
  
  // ALIADOS Y ENEMIGOS
  createElegantBox(20, currentY, 82, 70, "👥 ALIADOS", colors.emerald);
  createElegantBox(108, currentY, 82, 70, "⚔ ENEMIGOS", colors.crimsonRed);
  
  createElegantLines(30, currentY + 25, 65, 5, 8);
  createElegantLines(118, currentY + 25, 65, 5, 8);
  
  currentY += 80;
  
  // TESOROS Y RIQUEZAS
  createElegantBox(20, currentY, 170, 60, "💰 TESOROS Y RIQUEZAS", colors.royalGold);
  
  const currencies = [
    { name: "MONEDAS DE ORO", x: 30 },
    { name: "MONEDAS DE PLATA", x: 80 },
    { name: "MONEDAS DE COBRE", x: 130 }
  ];
  
  currencies.forEach(currency => {
    doc.setTextColor(...colors.burnishedGold);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(currency.name + ":", currency.x, currentY + 25);
    createElegantLines(currency.x, currentY + 35, 40, 1);
  });
  
  doc.setTextColor(...colors.burnishedGold);
  doc.text("OBJETOS VALIOSOS:", 30, currentY + 50);
  createElegantLines(30, currentY + 60, 150, 1);
  
  currentY += 70;
  
  // NOTAS ADICIONALES
  if (currentY < 220) {
    createElegantBox(20, currentY, 170, 50, "📝 NOTAS DE AVENTURA", colors.sapphire);
    createElegantLines(30, currentY + 20, 150, 4, 8);
  }
  
  // PIE DE PÁGINA FINAL
  doc.setDrawColor(...colors.royalGold);
  doc.setLineWidth(2);
  doc.line(20, 270, 190, 270);
  
  doc.setTextColor(...colors.deepPurple);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const finalFooter = "¡Que tus aventuras sean épicas y tus dados siempre favorables!";
  const finalFooterWidth = doc.getTextWidth(finalFooter);
  doc.text(finalFooter, (210 - finalFooterWidth) / 2, 280);
  
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
