// js/login.js
import { loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await loginUser(email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
    }
  });
});
