// dashboard.js - Funcionalidad para el panel de usuario

document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si el usuario está autenticado
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar datos del usuario
    loadUserData(currentUser);

    // Cargar personajes recientes
    loadRecentCharacters(currentUser);

    // Cargar campañas recientes
    loadRecentCampaigns(currentUser);
    
    // Cargar actividades recientes
    loadRecentActivities(currentUser);
    
    // Configurar el botón para guardar cambios en el perfil
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', handleProfileUpdate);
    }
    
    // Cargar datos del perfil en el formulario de edición cuando se abre el modal
    const editProfileModal = document.getElementById('editProfileModal');
    if (editProfileModal) {
        editProfileModal.addEventListener('show.bs.modal', function() {
            loadProfileData();
        });
    }
});

// Función para obtener el usuario actual
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Función para cargar los datos del usuario
function loadUserData(user) {
    // Actualizar nombre de usuario y email en el perfil
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const avatarInitials = document.getElementById('avatar-initials');

    // Obtener datos completos del usuario
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.id === user.id);
    
    if (userData) {
        if (profileName) profileName.textContent = `${userData.nombre} ${userData.apellido}`;
        if (profileUsername) profileUsername.textContent = userData.username;
        if (profileEmail) profileEmail.textContent = userData.email;
        if (avatarInitials) avatarInitials.textContent = `${userData.nombre.charAt(0)}${userData.apellido.charAt(0)}`.toUpperCase();
        
        // Cargar estadísticas
        loadUserStats(userData);
    }
}

// Función para cargar las estadísticas del usuario
function loadUserStats(userData) {
    // Obtener elementos de estadísticas
    const characterCount = document.getElementById('character-count');
    const campaignCount = document.getElementById('campaign-count');
    const rollCount = document.getElementById('roll-count');
    
    const characters = userData.characters || [];
    const campaigns = userData.campaigns || [];
    const activities = userData.activities || [];
    const rolls = activities.filter(a => a.type === 'dice_roll');

    // Actualizar contadores
    if (characterCount) characterCount.textContent = characters.length;
    if (campaignCount) campaignCount.textContent = campaigns.length;
    if (rollCount) rollCount.textContent = rolls.length;
}

// Función para cargar personajes recientes
function loadRecentCharacters(user) {
    const recentCharactersContainer = document.getElementById('recent-characters');
    if (!recentCharactersContainer) return;

    // Obtener personajes del usuario
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.id === user.id);
    
    if (!userData || !userData.characters || userData.characters.length === 0) {
        recentCharactersContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>No has creado ningún personaje todavía.
                </div>
            </div>
        `;
        return;
    }

    // Limpiar el contenedor
    recentCharactersContainer.innerHTML = '';

    // Mostrar los 3 personajes más recientes
    const recentCharacters = userData.characters.slice(0, 3);

    recentCharacters.forEach(character => {
        const characterCard = createCharacterCard(character);
        recentCharactersContainer.appendChild(characterCard);
    });
}

// Función para crear una tarjeta de personaje
function createCharacterCard(character) {
    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="avatar-sm me-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background-color: var(--primary); color: white;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <h4 class="h6 mb-0">${character.name}</h4>
                </div>
                <p class="card-text small mb-2">
                    <span class="fw-bold">Raza:</span> ${character.race}
                </p>
                <p class="card-text small mb-2">
                    <span class="fw-bold">Clase:</span> ${character.class}
                </p>
                <p class="card-text small mb-2">
                    <span class="fw-bold">Nivel:</span> ${character.level}
                </p>
                <div class="d-flex justify-content-end mt-3">
                    <a href="creacion.html?id=${character.id}" class="btn btn-sm btn-outline-primary me-2" style="border-color: var(--primary); color: var(--primary);">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCharacter('${character.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}

// Función para cargar campañas recientes
function loadRecentCampaigns(user) {
    const recentCampaignsContainer = document.getElementById('recent-campaigns');
    if (!recentCampaignsContainer) return;

    // Obtener campañas del usuario
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.id === user.id);
    
    if (!userData || !userData.campaigns || userData.campaigns.length === 0) {
        recentCampaignsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>No participas en ninguna campaña todavía.
                </div>
            </div>
        `;
        return;
    }

    // Limpiar el contenedor
    recentCampaignsContainer.innerHTML = '';

    // Mostrar las 3 campañas más recientes
    const recentCampaigns = userData.campaigns.slice(0, 3);

    recentCampaigns.forEach(campaign => {
        const campaignCard = createCampaignCard(campaign);
        recentCampaignsContainer.appendChild(campaignCard);
    });
}

// Función para crear una tarjeta de campaña
function createCampaignCard(campaign) {
    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="avatar-sm me-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background-color: var(--primary); color: white;">
                        <i class="bi bi-map-fill"></i>
                    </div>
                    <h4 class="h6 mb-0">${campaign.name}</h4>
                </div>
                <p class="card-text small mb-2">
                    <span class="fw-bold">DM:</span> ${campaign.dm}
                </p>
                <p class="card-text small mb-2">
                    <span class="fw-bold">Jugadores:</span> ${campaign.players.length}
                </p>
                <p class="card-text small mb-2">
                    <span class="fw-bold">Próxima sesión:</span> ${new Date(campaign.nextSession).toLocaleDateString()}
                </p>
            </div>
        </div>
    `;

    return col;
}

// Función para cargar actividades recientes
function loadRecentActivities(user) {
    const recentActivitiesContainer = document.getElementById('recent-activities');
    if (!recentActivitiesContainer) return;

    // Obtener actividades del usuario
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.id === user.id);
    
    if (!userData || !userData.activities || userData.activities.length === 0) {
        recentActivitiesContainer.innerHTML = `
            <div class="alert alert-info mb-0">
                <i class="bi bi-info-circle me-2"></i>No hay actividades recientes.
            </div>
        `;
        return;
    }

    // Limpiar el contenedor
    recentActivitiesContainer.innerHTML = '';

    // Mostrar las 5 actividades más recientes
    const recentActivities = userData.activities.slice(0, 5);

    // Crear lista de actividades
    const activityList = document.createElement('ul');
    activityList.className = 'list-group list-group-flush';

    recentActivities.forEach(activity => {
        const activityItem = document.createElement('li');
        activityItem.className = 'list-group-item d-flex align-items-center';
        
        // Determinar icono según el tipo de actividad
        let icon = 'bi-activity';
        let iconColor = 'var(--primary)';
        
        switch (activity.type) {
            case 'login':
                icon = 'bi-box-arrow-in-right';
                break;
            case 'logout':
                icon = 'bi-box-arrow-right';
                break;
            case 'register':
                icon = 'bi-person-plus';
                break;
            case 'profile_update':
                icon = 'bi-pencil';
                break;
            case 'dice_roll':
                icon = 'bi-dice-6';
                break;
            case 'character_create':
                icon = 'bi-person-plus';
                break;
            case 'character_update':
                icon = 'bi-person-gear';
                break;
            case 'character_delete':
                icon = 'bi-person-dash';
                iconColor = '#dc3545';
                break;
        }
        
        // Formatear fecha
        const date = new Date(activity.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        activityItem.innerHTML = `
            <div class="activity-icon me-3 rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: rgba(219, 148, 41, 0.2);">
                <i class="bi ${icon}" style="color: ${iconColor};"></i>
            </div>
            <div>
                <p class="mb-0">${activity.description}</p>
                <small class="text-muted">${formattedDate}</small>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
    
    recentActivitiesContainer.appendChild(activityList);
}

// Función para eliminar un personaje
function deleteCharacter(characterId) {
    if (confirm('¿Estás seguro de que deseas eliminar este personaje?')) {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // Obtener usuarios registrados
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            const user = users[userIndex];
            const characterIndex = user.characters.findIndex(c => c.id === characterId);
            
            if (characterIndex !== -1) {
                // Obtener nombre del personaje para el registro de actividad
                const characterName = user.characters[characterIndex].name;
                
                // Eliminar personaje
                user.characters.splice(characterIndex, 1);
                
                // Registrar actividad
                addActivity(user.id, 'character_delete', `Personaje eliminado: ${characterName}`);
                
                // Guardar cambios
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Recargar personajes
                loadRecentCharacters(currentUser);
                
                // Actualizar estadísticas
                loadUserStats(user);
                
                // Recargar actividades
                loadRecentActivities(currentUser);
            }
        }
    }
}

// Función para registrar actividad del usuario
function addActivity(userId, type, description) {
    // Obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar usuario por ID
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        // Crear nueva actividad
        const activity = {
            id: Date.now().toString(36),
            type,
            description,
            timestamp: new Date().toISOString()
        };
        
        // Agregar actividad al usuario
        if (!users[userIndex].activities) {
            users[userIndex].activities = [];
        }
        
        users[userIndex].activities.unshift(activity);
        
        // Limitar a 10 actividades
        if (users[userIndex].activities.length > 10) {
            users[userIndex].activities = users[userIndex].activities.slice(0, 10);
        }
        
        // Guardar en localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Placeholder functions to avoid errors.  These should be implemented elsewhere.
function handleProfileUpdate() {
  console.log("handleProfileUpdate function called");
}

function loadProfileData() {
  console.log("loadProfileData function called");
}