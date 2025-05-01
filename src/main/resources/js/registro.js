document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm")
    const errorAlert = document.getElementById("errorAlert")

    if (registroForm) {
        registroForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const username = document.getElementById("username").value
            const password = document.getElementById("password").value
            const confirmPassword = document.getElementById("confirmPassword").value

            // validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                errorAlert.classList.remove("d-none")
                return
            } else {
                errorAlert.classList.add("d-none")
            }

            // aqui hay que conectar con el back
            // simulación de registro exitoso hay que cambiar
            console.log("Registrando usuario:", { username, password })

            // aqui se redireciona alñ login
            window.location.href = "login.html"
        })
    }
})

