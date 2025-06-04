// js/config.js
export const API_BASE_URL =
  location.hostname === "localhost"
    ? "http://192.168.1.17:8080"            // tu back local
    : "https://tfg-dragonesymazmorras.onrender.com"; // producción
