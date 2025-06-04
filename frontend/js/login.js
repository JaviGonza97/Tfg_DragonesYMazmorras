// js/login.js
import { loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorAlert = document.getElementById("login-alert");
  const successAlert = document.getElementById("login-success");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await loginUser(email, password);

      errorAlert.classList.add("d-none");
      successAlert.classList.remove("d-none");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      successAlert.classList.add("d-none");
      errorAlert.classList.remove("d-none");
    }
  });
});
