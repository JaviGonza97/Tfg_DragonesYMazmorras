document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm")

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const username = document.getElementById("username").value
            const password = document.getElementById("password").value

            // coneccion con el back
            // haremos como si el login fuera exitoso, en futuro hay que juntarlo al back
            console.log("Iniciando sesión con:", { username, password })

            // guardar estado de login en localStorage
            // simulacion que hay que caMbiar
            localStorage.setItem("dndLoggedIn", "true")
            localStorage.setItem("dndUsername", username)

            // simulacion de que el usuario tiene personajes
            localStorage.setItem("dndHasCharacters", "true")

            window.location.href = "dashboard.html"
        })
    }
})

