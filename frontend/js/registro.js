import { registerUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-form");
  const errorBox = document.getElementById("registro-error");
  const errorMsg = document.getElementById("registro-error-message");

  if (!form) {
    console.error("No se encontró el formulario con ID 'registro-form'");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiar estado previo
    errorBox.classList.add("d-none");
    errorMsg.textContent = "";

    const username = document.getElementById("registro-username").value.trim();
    const email = document.getElementById("registro-email").value.trim();
    const password = document.getElementById("registro-password").value;
    const passwordConfirm = document.getElementById("registro-password-confirm").value;

    // Validaciones frontend
    if (!username || username.length < 4) {
      mostrarError("El nombre de usuario debe tener al menos 4 caracteres.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarError("Por favor introduce un correo electrónico válido.");
      return;
    }

    if (!password || password.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      mostrarError("Las contraseñas no coinciden.");
      return;
    }

    const registroDto = {
      username,
      email,
      password,
      passwordConfirm,
    };

    console.log("Enviando al backend:", registroDto);

    try {
      await registerUser(registroDto);
      document.getElementById("registro-success").classList.remove("d-none");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch (err) {
      console.error("Error al registrar:", err);
      mostrarError(err.message || "Error al registrar. Inténtalo más tarde.");
    }
  });

  function mostrarError(mensaje) {
    errorMsg.textContent = mensaje;
    errorBox.classList.remove("d-none");
  }
});
