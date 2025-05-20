// login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === '1234') {
      alert('Inicio de sesión exitoso');
      window.location.href = 'dashboard.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });
});
