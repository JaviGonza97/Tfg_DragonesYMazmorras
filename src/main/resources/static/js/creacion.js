// creacion.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('character-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const personaje = {
      name: document.getElementById('name').value,
      race: document.getElementById('race').value,
      class: document.getElementById('class').value,
      equipment: {
        name: document.getElementById('equipment-name').value,
        type: document.getElementById('equipment-type').value,
        level: document.getElementById('equipment-level').value
      },
      skill: {
        name: document.getElementById('skill-name').value,
        value: parseInt(document.getElementById('skill-value').value)
      },
      spell: {
        name: document.getElementById('spell-name').value,
        description: document.getElementById('spell-desc').value
      }
    };

    console.log("Personaje creado:", personaje);
    alert("Personaje guardado exitosamente.");
  });
});
