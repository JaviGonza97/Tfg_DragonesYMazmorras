// js/api.js

const API_BASE_URL = "http://192.168.1.17:8080"; // Ajusta al dominio/IP real de tu backend

/**
 * Función para realizar solicitudes a la API.
 * @param {string} endpoint - Ruta del endpoint (ej: "/api/personajes").
 * @param {string} method - Método HTTP (ej: "GET", "POST", etc.).
 * @param {Object|null} data - Datos a enviar como body (si aplica).
 * @param {boolean} requiresAuth - Si requiere autenticación con JWT.
 * @returns {Promise<Object|null>} - Respuesta JSON o null si no hay contenido.
 */
export async function apiRequest(endpoint, method = "GET", data = null, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      throw new Error("No token provided. Por favor, inicia sesión.");
    }
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch (networkError) {
    console.error("Error de red o conexión:", networkError);
    throw new Error("Error de red. Verifica tu conexión.");
  }

  // Manejo para respuestas vacías (ej: DELETE o 204 No Content)
  const responseBody = response.status === 204
    ? null
    : await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Respuesta con error del backend:", responseBody);
    const backendMsg = responseBody.message || responseBody.detail || "Error en la solicitud al servidor";
    throw new Error(backendMsg);
  }

  return responseBody;
}
