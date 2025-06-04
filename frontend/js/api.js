// js/api.js
const API_BASE_URL =
  (location.hostname === "localhost")
    ? "http://localhost:8080"                       // desarrollo local
    : "https://tfg-dragonesymazmorras.onrender.com"; // back-end en Render

export async function apiRequest(endpoint, method = "GET", data = null, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new Error("No token provided");
    }
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la solicitud");
  }

  return response.json();
}
