// js/registro.js
import { registerUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("registro-nombre").value;
    const apellido = document.getElementById("registro-apellido").value;
    const email = document.getElementById("registro-email").value;
    const password = document.getElementById("registro-password").value;

    const registroDto = { nombre, apellido, email, password };

    try {
      await registerUser(registroDto);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  });
});
