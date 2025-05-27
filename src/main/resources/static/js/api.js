// api.js — módulo de peticiones autenticadas

export function getToken() {
  return localStorage.getItem("token");
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Token no disponible");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers
  };

  const res = await fetch("http://localhost:8080" + url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Error en la petición");
  }

  return res.json();
}