document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const galeriaContainer = document.getElementById('galeria-personajes');
  const authStatusContainer = document.getElementById('auth-status-container');
  const noCharactersContainer = document.getElementById('no-characters-container');
  
  // Verificar si el usuario está autenticado
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Si no hay usuario autenticado, mostrar mensaje y opciones de login/registro
  if (!currentUser) {
    authStatusContainer.innerHTML = `
      <div class="alert alert-info text-center">
        <i class="bi bi-info-circle me-2"></i>
        <span>Necesitas iniciar sesión para ver tus personajes.</span>
        <div class="mt-3">
          <a href="login.html" class="btn me-2" style="background-color: var(--primary); color: white;">
            <i class="bi bi-door-open me-2"></i>Iniciar sesión
          </a>
          <a href="registro.html" class="btn btn-outline-secondary">
            <i class="bi bi-person-plus me-2"></i>Registrarse
          </a>
        </div>
      </div>
    `;
    return;
  }
  
  // Obtener datos del usuario y sus personajes
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userData = users.find(u => u.id === currentUser.id);
  
  // Si el usuario no tiene personajes, mostrar mensaje
  if (!userData || !userData.characters || userData.characters.length === 0) {
    galeriaContainer.innerHTML = '';
    noCharactersContainer.classList.remove('d-none');
    return;
  }
  
  // Mostrar los personajes del usuario
  galeriaContainer.innerHTML = '';
  userData.characters.forEach(character => {
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
          </div>
        </div>
      </div>
    `;
    galeriaContainer.appendChild(characterCard);
  });
  
  // Agregar eventos a los botones de ver detalles
  document.querySelectorAll('.view-character').forEach(button => {
    button.addEventListener('click', function() {
      const characterId = this.getAttribute('data-character-id');
      showCharacterDetails(characterId);
    });
  });
  
  // Función para mostrar los detalles de un personaje en el modal
  function showCharacterDetails(characterId) {
    const character = userData.characters.find(c => c.id === characterId);
    if (!character) return;
    
    // Actualizar el contenido del modal
    document.getElementById('character-name').textContent = character.name;
    document.getElementById('character-race-class').textContent = `${character.race || 'Raza no especificada'} - ${character.class || 'Clase no especificada'} - Nivel ${character.level || '1'}`;
    document.getElementById('character-avatar-initial').textContent = character.name.charAt(0).toUpperCase();
    document.getElementById('edit-character-link').href = `creacion.html?id=${character.id}`;
    
    // Generar estadísticas del personaje
    const statsContainer = document.getElementById('character-stats');
    statsContainer.innerHTML = '';
    
    const stats = [
      { name: 'FUE', value: character.strength || Math.floor(Math.random() * 10) + 10 },
      { name: 'DES', value: character.dexterity || Math.floor(Math.random() * 10) + 10 },
      { name: 'CON', value: character.constitution || Math.floor(Math.random() * 10) + 10 },
      { name: 'INT', value: character.intelligence || Math.floor(Math.random() * 10) + 10 },
      { name: 'SAB', value: character.wisdom || Math.floor(Math.random() * 10) + 10 },
      { name: 'CAR', value: character.charisma || Math.floor(Math.random() * 10) + 10 }
    ];
    
    stats.forEach(stat => {
      const statCol = document.createElement('div');
      statCol.className = 'col-4 col-md-4 mb-3 text-center';
      statCol.innerHTML = `
        <div class="stat-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
             style="width: 50px; height: 50px; background-color: rgba(219, 148, 41, 0.2);">
          <span style="color: var(--primary); font-weight: bold;">${stat.value}</span>
        </div>
        <p class="mb-0 small">${stat.name}</p>
      `;
      statsContainer.appendChild(statCol);
    });
    
    // Generar habilidades y equipamiento
    const abilitiesContainer = document.getElementById('character-abilities');
    abilitiesContainer.innerHTML = '';
    
    // Si el personaje tiene habilidades, mostrarlas
    if (character.abilities && character.abilities.length > 0) {
      const abilitiesList = document.createElement('div');
      abilitiesList.innerHTML = `
        <h5 class="h6 mb-2">Habilidades</h5>
        <ul class="list-group list-group-flush mb-3">
          ${character.abilities.map(ability => `<li class="list-group-item">${ability}</li>`).join('')}
        </ul>
      `;
      abilitiesContainer.appendChild(abilitiesList);
    } else {
      // Generar habilidades de ejemplo basadas en la clase
      const exampleAbilities = getExampleAbilities(character.class);
      const abilitiesList = document.createElement('div');
      abilitiesList.innerHTML = `
        <h5 class="h6 mb-2">Habilidades</h5>
        <ul class="list-group list-group-flush mb-3">
          ${exampleAbilities.map(ability => `<li class="list-group-item">${ability}</li>`).join('')}
        </ul>
      `;
      abilitiesContainer.appendChild(abilitiesList);
    }
    
    // Si el personaje tiene equipamiento, mostrarlo
    if (character.equipment && character.equipment.length > 0) {
      const equipmentList = document.createElement('div');
      equipmentList.innerHTML = `
        <h5 class="h6 mb-2 mt-3">Equipamiento</h5>
        <ul class="list-group list-group-flush">
          ${character.equipment.map(item => `<li class="list-group-item">${item}</li>`).join('')}
        </ul>
      `;
      abilitiesContainer.appendChild(equipmentList);
    } else {
      // Generar equipamiento de ejemplo basado en la clase
      const exampleEquipment = getExampleEquipment(character.class);
      const equipmentList = document.createElement('div');
      equipmentList.innerHTML = `
        <h5 class="h6 mb-2 mt-3">Equipamiento</h5>
        <ul class="list-group list-group-flush">
          ${exampleEquipment.map(item => `<li class="list-group-item">${item}</li>`).join('')}
        </ul>
      `;
      abilitiesContainer.appendChild(equipmentList);
    }
    
    // Mostrar el modal
    const characterModal = new bootstrap.Modal(document.getElementById('characterModal'));
    characterModal.show();
  }
  
  // Función para obtener habilidades de ejemplo basadas en la clase
  function getExampleAbilities(characterClass) {
    const classLower = (characterClass || '').toLowerCase();
    
    const abilitiesByClass = {
      'guerrero': ['Segundo aliento', 'Estilo de combate', 'Acción adicional', 'Crítico mejorado'],
      'mago': ['Lanzamiento de hechizos', 'Recuperación arcana', 'Tradición arcana', 'Maestría de hechizos'],
      'clérigo': ['Lanzamiento de hechizos', 'Canalizar divinidad', 'Dominio divino', 'Intervención divina'],
      'pícaro': ['Pericia', 'Ataque furtivo', 'Acción astuta', 'Evasión'],
      'bardo': ['Inspiración bárdica', 'Canción de descanso', 'Pericia', 'Palabras cortantes'],
      'druida': ['Lanzamiento de hechizos', 'Forma salvaje', 'Círculo druídico', 'Cuerpo atemporal'],
      'paladín': ['Sentido divino', 'Imposición de manos', 'Juramento sagrado', 'Aura de protección'],
      'explorador': ['Enemigo favorito', 'Explorador natural', 'Estilo de combate', 'Conciencia primigenia'],
      'hechicero': ['Lanzamiento de hechizos', 'Origen de hechicería', 'Metamagia', 'Restauración hechicera'],
      'brujo': ['Lanzamiento de hechizos', 'Patrón sobrenatural', 'Pacto de la magia', 'Maestro místico']
    };
    
    // Devolver habilidades para la clase o habilidades genéricas si no se encuentra
    return abilitiesByClass[classLower] || [
      'Ataque básico', 
      'Defensa', 
      'Percepción', 
      'Supervivencia'
    ];
  }
  
  // Función para obtener equipamiento de ejemplo basado en la clase
  function getExampleEquipment(characterClass) {
    const classLower = (characterClass || '').toLowerCase();
    
    const equipmentByClass = {
      'guerrero': ['Espada larga', 'Escudo', 'Cota de malla', 'Mochila de aventurero'],
      'mago': ['Bastón arcano', 'Libro de hechizos', 'Túnica de mago', 'Componentes de hechizos'],
      'clérigo': ['Maza', 'Escudo', 'Armadura de placas', 'Símbolo sagrado'],
      'pícaro': ['Daga (2)', 'Armadura de cuero', 'Herramientas de ladrón', 'Capa de sigilo'],
      'bardo': ['Espada corta', 'Instrumento musical', 'Armadura de cuero', 'Amuleto de inspiración'],
      'druida': ['Bastón de madera', 'Foco druídico', 'Armadura de cuero', 'Hierbas medicinales'],
      'paladín': ['Martillo de guerra', 'Escudo', 'Armadura de placas', 'Símbolo sagrado'],
      'explorador': ['Arco largo', 'Espada corta', 'Armadura de cuero tachonado', 'Trampa para animales'],
      'hechicero': ['Daga', 'Foco arcano', 'Túnica elegante', 'Amuleto de poder'],
      'brujo': ['Daga ritual', 'Foco arcano', 'Túnica oscura', 'Grimorio prohibido']
    };
    
    // Devolver equipamiento para la clase o equipamiento genérico si no se encuentra
    return equipmentByClass[classLower] || [
      'Arma simple', 
      'Armadura ligera', 
      'Mochila', 
      'Raciones (5 días)'
    ];
  }
  
  // Agregar estilos CSS dinámicos para efectos hover
  const style = document.createElement('style');
  style.textContent = `
    .hover-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
  `;
  document.head.appendChild(style);
});