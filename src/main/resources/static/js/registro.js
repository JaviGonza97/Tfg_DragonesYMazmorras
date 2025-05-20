// registro.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    alert(`Usuario ${user} registrado con éxito.`);
    // Aquí puedes hacer un fetch al backend si deseas enviar los datos
    window.location.href = 'login.html';
  });
});
