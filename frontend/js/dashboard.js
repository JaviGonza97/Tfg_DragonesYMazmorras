// js/dashboard.js
import { getUserInfo, logoutUser, isAuthenticated } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  const user = getUserInfo();

  if (user) {
    document.getElementById("profile-username").textContent = user.username || `${user.nombre}`;
    document.getElementById("profile-email").textContent = user.email || "email vinculado";
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});
