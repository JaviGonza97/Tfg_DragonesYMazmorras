document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1
    const totalSteps = 5

    const stepButtons = document.querySelectorAll(".step-btn")
    const stepContents = document.querySelectorAll(".step-content")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const progressBar = document.querySelector(".progress-bar")

    // funciom para mostrar el paso actual
    function showStep(step) {

        stepContents.forEach((content) => {
            content.classList.add("d-none")
        })
        document.getElementById(`step${step}`).classList.remove("d-none")

        // actualizar botones de pasos
        stepButtons.forEach((btn, index) => {
            if (index + 1 === step) {
                btn.classList.add("active")
            } else {
                btn.classList.remove("active")
            }
        })

        // actualizar barra de progreso
        progressBar.style.width = `${(step / totalSteps) * 100}%`

        // Mostrar/ocultar botones de navegación
        if (step === 1) {
            prevBtn.style.visibility = "hidden"
        } else {
            prevBtn.style.visibility = "visible"
        }

        if (step === totalSteps) {
            nextBtn.textContent = "Crear Personaje"
            nextBtn.classList.remove("btn-custom-amber")
            nextBtn.classList.add("btn-success")
        } else {
            nextBtn.textContent = "Siguiente"
            nextBtn.classList.add("btn-custom-amber")
            nextBtn.classList.remove("btn-success")
        }
    }

    //botones de pasos
    stepButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            currentStep = Number.parseInt(this.getAttribute("data-step"))
            showStep(currentStep)
        })
    })

    //botón anterior
    prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--
            showStep(currentStep)
        }
    })

    // botón siguiente
    nextBtn.addEventListener("click", () => {
        if (currentStep < totalSteps) {
            currentStep++
            showStep(currentStep)
        } else {

            const formData = new FormData(document.getElementById("creacionForm"))
            const character = {}

            for (const [key, value] of formData.entries()) {
                if (key.includes(".")) {
                    const [section, field] = key.split(".")
                    if (!character[section]) {
                        character[section] = {}
                    }
                    character[section][field] = value
                } else {
                    character[key] = value
                }
            }

            // Aquí conectaremos en un futuro con el back
            console.log("Personaje creado:", character)

            localStorage.setItem("dndHasCharacters", "true")

            window.location.href = "dashboard.html"
        }
    })

    showStep(currentStep)
})

