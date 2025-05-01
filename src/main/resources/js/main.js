document.addEventListener("DOMContentLoaded", () => {
    // Comprobar si hay un usuario loguead
    // simulacion hay que juntarlo con el back
    const isLoggedIn = localStorage.getItem("dndLoggedIn") === "true"

    // Comprobar si hay personajes
    // simulacion que hay que juntar con el back
    const hasCharacters = localStorage.getItem("dndHasCharacters") === "true"

    // mensaje de "No tienes personajes"
    const noPersonajesElement = document.getElementById("no-personajes")
    if (noPersonajesElement) {
        if (isLoggedIn && !hasCharacters) {
            noPersonajesElement.classList.remove("d-none")
        } else {
            noPersonajesElement.classList.add("d-none")
        }
    }
})

