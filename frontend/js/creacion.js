// js/creacion.js
import { apiRequest } from "./api.js";
import { requireAuth, getUserInfo } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const formBtn = document.getElementById("create-character");

  formBtn.addEventListener("click", async () => {
    const nombre = document.getElementById("character-name").value;
    const nivel = parseInt(document.getElementById("character-level").value);
    const raza = document.querySelector(".race-card.selected")?.dataset.race;
    const clase = document.querySelector(".class-card.selected")?.dataset.class;

    const fuerza = parseInt(document.getElementById("fuerza-value").textContent);
    const destreza = parseInt(document.getElementById("destreza-value").textContent);
    const defensa = parseInt(document.getElementById("defensa-value").textContent);
    const magia = parseInt(document.getElementById("magia-value").textContent);

    const hechizoNombre = document.getElementById("spell-name")?.value || null;
    const hechizoDescripcion = document.getElementById("spell-description")?.value || null;

    // Equipamiento: asumiendo que hay <li class="equipment-item"> con dataset.type y texto
    const items = Array.from(document.querySelectorAll("#equipment-list .equipment-item"))
      .map(el => el.textContent.trim());

    if (!nombre || !raza || !clase) {
      alert("Debes completar el nombre, raza y clase del personaje.");
      return;
    }

    const payload = {
      nombre,
      nivel,
      raza,
      clase,
      fuerza,
      destreza,
      defensa,
      magia,
      hechizoNombre,
      hechizoDescripcion,
      equipamiento: items
    };

    try {
      await apiRequest("/personajes", "POST", payload, true);
      alert("Personaje creado con éxito.");
      window.location.href = "Galeria.html";
    } catch (err) {
      alert("Error al crear personaje: " + err.message);
    }
  });
});
