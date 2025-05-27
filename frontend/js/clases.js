// clases.js
import { fetchWithAuth } from "./api.js";

export async function obtenerClases() {
  try {
    const clases = await fetchWithAuth("/api/clases");
    return clases; // [{ id: 1, nombre: "Guerrero" }, ...]
  } catch (err) {
    console.error("Error al obtener clases:", err);
    return [];
  }
}
