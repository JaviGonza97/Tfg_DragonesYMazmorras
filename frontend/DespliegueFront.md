# TFG - Dragones y Mazmorras - Frontend

Este es el **frontend** del TFG “Dragones y Mazmorras”, una app para crear, editar y gestionar personajes de D&D.

- **Frontend:** HTML, CSS y JS (Bootstrap).  
- **Desplegado en:** [https://tfg-dragones-y-mazmorras.vercel.app](https://tfg-dragones-y-mazmorras.vercel.app)  
- **Backend:** Spring Boot, desplegado en Render.

---

## 🚀 Deploy en Vercel

El frontend está desplegado como proyecto estático en Vercel.  
**¡No hace falta configuración especial!**

### Pasos seguidos:

1. **Código subido a GitHub.**
2. **Nuevo proyecto en [Vercel](https://vercel.com/):**
   - Importa el repo desde GitHub.
   - Selecciona framework `Other` o `Static`.
   - Vercel detecta el `index.html` y lo publica como estático.
3. **La web se sirve en:**  
   [https://tfg-dragones-y-mazmorras.vercel.app](https://tfg-dragones-y-mazmorras.vercel.app)
4. **No se requieren variables de entorno**, la URL del backend se gestiona en el JS.

---

## 🌐 Configuración de backend

En `/js/config.js` la URL del backend se selecciona automáticamente:

```js
export const API_BASE_URL =
  location.hostname === "localhost"
    ? "http://192.168.1.17:8080"
    : "https://tfg-dragonesymazmorras.onrender.com";

    Desarrollo local: usa el backend local.

Producción (Vercel): usa el backend de Render.

Autenticación
Autenticación vía JWT.

El token se guarda en localStorage y se incluye en cada petición protegida.

Logout limpia el token y redirige a login.

Código relevante
/js/api.js: Gestión de peticiones a la API.

/js/auth.js: Login, logout, y protección de páginas.

/js/config.js: Selección dinámica de backend.

Consideraciones
El backend debe permitir CORS desde el dominio de Vercel.

Todo el frontend funciona sobre HTTPS.

Si despliegas cambios, Vercel actualiza automáticamente tu web.

Prueba online
Accede directamente aquí:
https://tfg-dragones-y-mazmorras.vercel.appgit