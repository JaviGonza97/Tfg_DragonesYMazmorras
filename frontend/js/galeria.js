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

// Función mejorada para exportar PDF con diseño auténtico de D&D
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
    // Fondo base color pergamino claro
    doc.setFillColor(...colors.lightSepia);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Patrón sutil (simulado con puntos muy claros)
    doc.setGState(new doc.GState({opacity: 0.05}));
    doc.setFillColor(...colors.sepia);
    
    // Crear patrón de puntos para simular textura
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
  function drawDecorativeFrame(x, y, width, height, title = null) {
    // Marco principal
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1);
    doc.roundedRect(x, y, width, height, 3, 3, 'S');
    
    // Marco interior
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.5);
    doc.roundedRect(x + 2, y + 2, width - 4, height - 4, 2, 2, 'S');
    
    // Título si existe
    if (title) {
      // Fondo del título
      doc.setFillColor(...colors.lightSepia);
      const titleWidth = doc.getTextWidth(title) + 10;
      doc.roundedRect(x + (width - titleWidth) / 2 - 2, y - 5, titleWidth + 4, 10, 3, 3, 'F');
      
      // Borde del título
      doc.setDrawColor(...colors.sepia);
      doc.roundedRect(x + (width - titleWidth) / 2 - 2, y - 5, titleWidth + 4, 10, 3, 3, 'S');
      
      // Texto del título
      doc.setTextColor(...colors.sepia);
      doc.setFontSize(10);
      doc.setFont("times", "bold");
      doc.text(title, x + (width - titleWidth) / 2, y);
    }
  }
  
  // Función para dibujar líneas punteadas para rellenar
  function drawDottedLine(x, y, width, text = null) {
    // Texto inicial si existe
    if (text) {
      doc.setTextColor(...colors.sepia);
      doc.setFontSize(9);
      doc.setFont("times", "bold");
      doc.text(text, x, y);
      x += doc.getTextWidth(text) + 3;
      width -= doc.getTextWidth(text) + 3;
    }
    
    // Línea punteada
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.3);
    
    const dotSpacing = 1.5;
    const dotCount = Math.floor(width / dotSpacing);
    
    for (let i = 0; i < dotCount; i++) {
      const dotX = x + (i * dotSpacing);
      doc.line(dotX, y, dotX + 0.5, y);
    }
    
    // Puntos decorativos en los extremos
    doc.setFillColor(...colors.gold);
    doc.circle(x, y, 0.8, 'F');
    doc.circle(x + width, y, 0.8, 'F');
  }
  
  // Función para dibujar círculos de estadísticas estilo D&D
  function drawStatCircle(x, y, statName, statValue) {
    // Marco exterior decorativo
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1);
    doc.circle(x, y, 12, 'S');
    
    // Círculo interior
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.5);
    doc.circle(x, y, 10, 'S');
    
    // Valor de la estadística
    doc.setTextColor(...colors.sepia);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    const valueWidth = doc.getTextWidth(statValue.toString());
    doc.text(statValue.toString(), x - valueWidth/2, y + 2);
    
    // Nombre de la estadística
    doc.setFontSize(8);
    doc.setFont("times", "bold");
    const nameWidth = doc.getTextWidth(statName);
    doc.text(statName, x - nameWidth/2, y + 18);
    
    // Decoración superior del círculo
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.5);
    const decorSize = 5;
    doc.line(x - decorSize, y - 12, x + decorSize, y - 12);
    doc.line(x, y - 12 - decorSize, x, y - 12);
  }
  
  // Función para dibujar encabezado con banner
  function drawBannerHeader(text) {
    // Cargar imagen de banner (simulado con dibujo)
    const bannerY = 20;
    const bannerHeight = 30;
    
    // Dibujar banner
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(1.5);
    
    // Parte central del banner
    doc.setFillColor(...colors.lightSepia);
    doc.roundedRect(20, bannerY, 170, bannerHeight, 2, 2, 'FD');
    
    // Bordes decorativos
    doc.setDrawColor(...colors.sepia);
    doc.setLineWidth(0.8);
    doc.roundedRect(22, bannerY + 2, 166, bannerHeight - 4, 1, 1, 'S');
    
    // Texto del banner
    doc.setTextColor(...colors.sepia);
    doc.setFontSize(24);
    doc.setFont("times", "bold");
    const textWidth = doc.getTextWidth("D&D");
    doc.text("D&D", (210 - textWidth) / 2, bannerY + 12);
    
    // Texto del personaje
    doc.setFontSize(16);
    doc.setFont("times", "italic");
    const nameText = "CHARACTER NAME";
    const nameWidth = doc.getTextWidth(nameText);
    doc.text(nameText, (210 - nameWidth) / 2, bannerY + 22);
    
    // Línea para el nombre
    drawDottedLine(50, bannerY + 28, 110);
  }
  
  // Crear fondo de pergamino
  createParchmentBackground();
  
  // Dibujar encabezado con banner
  drawBannerHeader(character.nombre);
  
  // SECCIÓN DE INFORMACIÓN BÁSICA
  let currentY = 60;
  
  // Marco para información básica
  drawDecorativeFrame(20, currentY, 170, 30);
  
  // Información básica en líneas
  drawDottedLine(30, currentY + 10, 50, "CLASS & LEVEL");
  drawDottedLine(120, currentY + 10, 60, "BACKGROUND");
  drawDottedLine(30, currentY + 20, 50, "RACE");
  drawDottedLine(120, currentY + 20, 60, "ALIGNMENT");
  
  // Rellenar información del personaje
  doc.setTextColor(...colors.darkSepia);
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(character.clase, 85, currentY + 10);
  doc.text(character.raza, 85, currentY + 20);
  
  currentY += 40;
  
  // SECCIÓN DE ATRIBUTOS PRINCIPALES
  const statStartY = currentY;
  const statWidth = 30;
  const statHeight = 40;
  const statSpacing = 35;
  
  // Estadísticas principales
  const stats = [
    { name: "FUERZA", value: character.fuerza },
    { name: "DESTREZA", value: character.destreza },
    { name: "RESISTENCIA", value: character.resistencia },
    { name: "MAGIA", value: character.magia }
  ];
  
  // Dibujar círculos de estadísticas
  stats.forEach((stat, index) => {
    const x = 35 + (index * statSpacing);
    drawStatCircle(x, statStartY + 20, stat.name, stat.value);
  });
  
  // Línea para modificadores
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(8);
  doc.setFont("times", "italic");
  doc.text("MOD:", 30, statStartY + 45);
  doc.text("MOD:", 65, statStartY + 45);
  doc.text("MOD:", 100, statStartY + 45);
  doc.text("MOD:", 135, statStartY + 45);
  
  drawDottedLine(45, statStartY + 45, 15);
  drawDottedLine(80, statStartY + 45, 15);
  drawDottedLine(115, statStartY + 45, 15);
  drawDottedLine(150, statStartY + 45, 15);
  
  currentY += 55;
  
  // SECCIÓN DE PUNTOS DE VIDA Y COMBATE
  drawDecorativeFrame(20, currentY, 80, 60, "HIT POINTS");
  
  // Puntos de vida
  drawDottedLine(30, currentY + 15, 60, "Maximum");
  drawDottedLine(30, currentY + 25, 60, "Current");
  drawDottedLine(30, currentY + 35, 60, "Temporary");
  
  // Estadísticas de combate
  drawDecorativeFrame(110, currentY, 80, 60, "COMBAT STATS");
  
  drawDottedLine(120, currentY + 15, 60, "ARMOR CLASS");
  drawDottedLine(120, currentY + 25, 60, "INITIATIVE");
  drawDottedLine(120, currentY + 35, 60, "SPEED");
  
  currentY += 70;
  
  // SECCIÓN DE HECHIZOS Y EQUIPAMIENTO
  const colWidth = 80;
  
  // Hechizos
  drawDecorativeFrame(20, currentY, colWidth, 70, "SPELLS");
  
  let spellY = currentY + 15;
  if (character.hechizos.length > 0) {
    character.hechizos.forEach((spell, index) => {
      if (index < 5) {
        doc.setFillColor(...colors.sepia);
        doc.circle(25, spellY, 1, 'F');
        
        doc.setTextColor(...colors.sepia);
        doc.setFontSize(9);
        doc.setFont("times", "normal");
        doc.text(spell, 30, spellY);
        
        spellY += 10;
      }
    });
  }
  
  // Equipamiento
  drawDecorativeFrame(110, currentY, colWidth, 70, "EQUIPMENT");
  
  let equipY = currentY + 15;
  if (character.equipo.length > 0) {
    character.equipo.forEach((item, index) => {
      if (index < 5) {
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
        doc.circle(115, equipY, 1, 'F');
        
        doc.setTextColor(...colors.sepia);
        doc.setFontSize(9);
        doc.setFont("times", "normal");
        doc.text(nombre, 120, equipY);
        
        if (tipo) {
          doc.setFontSize(7);
          doc.setFont("times", "italic");
          doc.text(`(${tipo})`, 120 + doc.getTextWidth(nombre + " "), equipY);
        }
        
        equipY += 10;
      }
    });
  }
  
  currentY += 80;
  
  // SECCIÓN DE ALIADOS Y ENEMIGOS
  drawDecorativeFrame(20, currentY, colWidth, 60, "ALIADOS");
  drawDecorativeFrame(110, currentY, colWidth, 60, "ENEMIGOS");
  
  // Líneas para aliados
  for (let i = 0; i < 5; i++) {
    drawDottedLine(25, currentY + 15 + (i * 8), 70);
  }
  
  // Líneas para enemigos
  for (let i = 0; i < 5; i++) {
    drawDottedLine(115, currentY + 15 + (i * 8), 70);
  }
  
  currentY += 70;
  
  // SECCIÓN DE TESOROS
  drawDecorativeFrame(20, currentY, 170, 50, "TESOROS Y RIQUEZAS");
  
  // Monedas
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  doc.text("MONEDAS DE ORO:", 30, currentY + 20);
  doc.text("MONEDAS DE PLATA:", 80, currentY + 20);
  doc.text("MONEDAS DE COBRE:", 130, currentY + 20);
  
  drawDottedLine(30, currentY + 30, 40);
  drawDottedLine(80, currentY + 30, 40);
  drawDottedLine(130, currentY + 30, 40);
  
  // Objetos valiosos
  doc.text("OBJETOS VALIOSOS:", 30, currentY + 40);
  drawDottedLine(30, currentY + 45, 150);
  
  // Pie de página
  doc.setTextColor(...colors.sepia);
  doc.setFontSize(10);
  doc.setFont("times", "italic");
  const footer = "¡Que tus aventuras sean épicas y tus dados siempre favorables!";
  const footerWidth = doc.getTextWidth(footer);
  doc.text(footer, (210 - footerWidth) / 2, 280);
  
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
