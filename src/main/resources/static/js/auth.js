document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Referencias a elementos de navegación
    const authLinks = document.querySelectorAll('.auth-link');
    const userLinks = document.querySelectorAll('.user-link');
    const usernameDisplay = document.getElementById('username-display');
    
    // Función para actualizar la navegación según el estado de autenticación
    function updateNavigation() {
        if (currentUser) {
            // Usuario autenticado
            authLinks.forEach(link => link.classList.add('d-none'));
            userLinks.forEach(link => link.classList.remove('d-none'));
            
            if (usernameDisplay) {
                usernameDisplay.textContent = ` ${currentUser.username}`;
            }
        } else {
            // Usuario no autenticado
            authLinks.forEach(link => link.classList.remove('d-none'));
            userLinks.forEach(link => link.classList.add('d-none'));
        }
    }
    
    // Actualizar navegación al cargar la página
    updateNavigation();
    
    // Manejar el cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('currentUser');
        
        // Mostrar mensaje de éxito
        const toastHTML = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header" style="background-color: var(--primary); color: white;">
                        <strong class="me-auto">D&D</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Sesión cerrada correctamente.
                    </div>
                </div>
            </div>
        `;
        
        const toastContainer = document.createElement('div');
        toastContainer.innerHTML = toastHTML;
        document.body.appendChild(toastContainer);
        
        // Redirigir a la página de inicio después de un breve retraso
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Formulario de inicio de sesión
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validar campos
            if (!email || !password) {
                showLoginAlert('Por favor, completa todos los campos.', 'danger');
                return;
            }
            
            // Obtener usuarios registrados
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Buscar usuario por email
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showLoginAlert('El email no está registrado.', 'danger');
                return;
            }
            
            // Verificar contraseña
            if (user.password !== password) {
                showLoginAlert('Contraseña incorrecta.', 'danger');
                return;
            }
            
            // Iniciar sesión
            const sessionUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido
            };
            
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            
            // Registrar actividad de inicio de sesión
            addUserActivity(user.id, 'login');
            
            // Mostrar mensaje de éxito
            showLoginAlert('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            // Redirigir al dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email-register').value;
            const password = document.getElementById('password-register').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Validar campos
            if (!nombre || !apellido || !username || !email || !password || !confirmPassword) {
                showRegisterAlert('Por favor, completa todos los campos.', 'danger');
                return;
            }
            
            if (!terms) {
                showRegisterAlert('Debes aceptar los términos y condiciones.', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showRegisterAlert('Las contraseñas no coinciden.', 'danger');
                return;
            }
            
            // Validar formato de contraseña
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                showRegisterAlert('La contraseña no cumple con los requisitos.', 'danger');
                return;
            }
            
            // Obtener usuarios registrados
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Verificar si el email ya está registrado
            if (users.some(u => u.email === email)) {
                showRegisterAlert('El email ya está registrado.', 'danger');
                return;
            }
            
            // Verificar si el username ya está registrado
            if (users.some(u => u.username === username)) {
                showRegisterAlert('El nombre de usuario ya está en uso.', 'danger');
                return;
            }
            
            // Crear nuevo usuario
            const newUser = {
                id: Date.now().toString(),
                nombre,
                apellido,
                username,
                email,
                password,
                characters: [],
                stats: {
                    characterCount: 0,
                    campaignCount: 0,
                    rollCount: 0
                },
                activities: [
                    {
                        type: 'register',
                        date: new Date().toISOString(),
                        details: {
                            message: 'Cuenta creada'
                        }
                    }
                ]
            };
            
            // Guardar usuario
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Mostrar mensaje de éxito
            showRegisterAlert('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
            
            // Redirigir al login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
    
    // Formulario de edición de perfil
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm && currentUser) {
        // Obtener datos del usuario
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === currentUser.id);
        
        if (user) {
            // Rellenar formulario con datos del usuario
            document.getElementById('edit-nombre').value = user.nombre || '';
            document.getElementById('edit-apellido').value = user.apellido || '';
            document.getElementById('edit-username').value = user.username || '';
            document.getElementById('edit-email').value = user.email || '';
        }
        
        // Manejar guardado de cambios
        const saveProfileBtn = document.getElementById('save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', function() {
                const nombre = document.getElementById('edit-nombre').value;
                const apellido = document.getElementById('edit-apellido').value;
                const username = document.getElementById('edit-username').value;
                const currentPassword = document.getElementById('edit-current-password').value;
                const newPassword = document.getElementById('edit-new-password').value;
                const confirmPassword = document.getElementById('edit-confirm-password').value;
                
                // Validar campos
                if (!nombre || !apellido || !username) {
                    alert('Por favor, completa los campos obligatorios.');
                    return;
                }
                
                // Obtener usuarios registrados
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                
                if (userIndex === -1) {
                    alert('Error al actualizar el perfil. Por favor, inicia sesión de nuevo.');
                    return;
                }
                
                // Verificar si el username ya está en uso por otro usuario
                if (username !== currentUser.username && users.some(u => u.username === username && u.id !== currentUser.id)) {
                    alert('El nombre de usuario ya está en uso.');
                    return;
                }
                
                // Verificar contraseña actual si se quiere cambiar la contraseña
                if (newPassword) {
                    if (!currentPassword) {
                        alert('Debes introducir tu contraseña actual para cambiarla.');
                        return;
                    }
                    
                    if (users[userIndex].password !== currentPassword) {
                        alert('La contraseña actual es incorrecta.');
                        return;
                    }
                    
                    if (newPassword !== confirmPassword) {
                        alert('Las nuevas contraseñas no coinciden.');
                        return;
                    }
                    
                    // Validar formato de contraseña
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (!passwordRegex.test(newPassword)) {
                        alert('La nueva contraseña no cumple con los requisitos de seguridad.');
                        return;
                    }
                    
                    // Actualizar contraseña
                    users[userIndex].password = newPassword;
                }
                
                // Actualizar datos del usuario
                users[userIndex].nombre = nombre;
                users[userIndex].apellido = apellido;
                users[userIndex].username = username;
                
                // Actualizar sesión actual
                const updatedUser = {
                    id: currentUser.id,
                    username: username,
                    email: currentUser.email,
                    nombre: nombre,
                    apellido: apellido
                };
                
                // Guardar cambios
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                // Registrar actividad
                addUserActivity(currentUser.id, 'profile_update');
                
                // Mostrar mensaje de éxito
                alert('Perfil actualizado correctamente.');
                
                // Cerrar modal
                const modalElement = document.getElementById('editProfileModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                // Recargar página para mostrar cambios
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
        }
    }
    
    // Funciones auxiliares
    
    // Mostrar alerta en el formulario de login
    function showLoginAlert(message, type) {
        const alertContainer = document.getElementById('login-alert');
        const successContainer = document.getElementById('login-success');
        const alertMessage = document.getElementById('login-alert-message');
        const successMessage = document.getElementById('login-success-message');
        
        if (type === 'danger') {
            alertMessage.textContent = message;
            alertContainer.classList.remove('d-none');
            successContainer.classList.add('d-none');
        } else {
            successMessage.textContent = message;
            successContainer.classList.remove('d-none');
            alertContainer.classList.add('d-none');
        }
    }
    
    // Mostrar alerta en el formulario de registro
    function showRegisterAlert(message, type) {
        const alertContainer = document.getElementById('register-error');
        const successContainer = document.getElementById('register-success');
        const alertMessage = document.getElementById('register-error-message');
        const successMessage = document.getElementById('register-success-message');
        
        if (type === 'danger') {
            alertMessage.textContent = message;
            alertContainer.classList.remove('d-none');
            successContainer.classList.add('d-none');
        } else {
            successMessage.textContent = message;
            successContainer.classList.remove('d-none');
            alertContainer.classList.add('d-none');
        }
    }
    
    // Añadir actividad al usuario
    function addUserActivity(userId, activityType, details = {}) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return;
        
        // Inicializar array de actividades si no existe
        if (!users[userIndex].activities) {
            users[userIndex].activities = [];
        }
        
        // Añadir nueva actividad
        users[userIndex].activities.unshift({
            type: activityType,
            date: new Date().toISOString(),
            details: details
        });
        
        // Limitar a 10 actividades
        if (users[userIndex].activities.length > 10) {
            users[userIndex].activities = users[userIndex].activities.slice(0, 10);
        }
        
        // Guardar cambios
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Manejar visibilidad de contraseña en login
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
    
    // Manejar visibilidad de contraseña en registro
    const togglePasswordRegister = document.getElementById('toggle-password-register');
    if (togglePasswordRegister) {
        togglePasswordRegister.addEventListener('click', function() {
            const passwordInput = document.getElementById('password-register');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
    
    // Manejar visibilidad de confirmación de contraseña en registro
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('confirm-password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
    
    // Manejar aceptación de términos y condiciones
    const acceptTermsBtn = document.getElementById('accept-terms');
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', function() {
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox) {
                termsCheckbox.checked = true;
            }
        });
    }
});