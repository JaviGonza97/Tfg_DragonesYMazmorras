import { fetchWithAuth } from "./api.js";
import { logoutUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameEl = document.getElementById("profile-username");
  const emailEl = document.getElementById("profile-email");
  const userProfile = document.getElementById("user-profile");

  try {
    const user = await fetchWithAuth("/api/usuarios/me");

    usernameEl.textContent = user.username || "Sin nombre";
    emailEl.textContent = user.email || "Sin correo";

  } catch (error) {
    userProfile.innerHTML = `
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        No se pudo cargar el perfil. <a href="login.html" class="alert-link">Inicia sesión</a>.
      </div>
    `;
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }
});
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
