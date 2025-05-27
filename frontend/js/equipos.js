// equipos.js
import { fetchWithAuth } from "./api.js";

export async function obtenerEquipos() {
  try {
    const equipos = await fetchWithAuth("/api/equipos");
    return equipos; // [{ id: 1, nombre: 'Espada', tipo: 'ARMA' }, ...]
  } catch (err) {
    console.error("Error al obtener equipos:", err);
    return [];
  }
}

export async function crearEquipo(nombre, tipo) {
  try {
    const nuevo = await fetchWithAuth("/api/equipos", {
      method: "POST",
      body: JSON.stringify({ nombre, tipo }),
    });
    return nuevo;
  } catch (err) {
    console.error("Error al crear equipo:", err);
    throw err;
  }
}
