// dados.js
document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('roll-d20');
  const resultado = document.getElementById('resultado-d20');

  boton.addEventListener('click', () => {
    const valor = Math.floor(Math.random() * 20) + 1;
    resultado.textContent = valor;
  });
});
