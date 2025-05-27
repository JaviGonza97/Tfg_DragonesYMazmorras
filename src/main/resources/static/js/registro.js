document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const success = document.getElementById("register-success");
  const error = document.getElementById("register-error");
  const errorMsg = document.getElementById("register-error-message");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email-register").value.trim(),
      password: document.getElementById("password-register").value.trim()
    };

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        success.classList.remove("d-none");
        error.classList.add("d-none");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        const msg = await response.text();
        errorMsg.textContent = msg || "Error en el registro.";
        error.classList.remove("d-none");
        success.classList.add("d-none");
      }

    } catch (err) {
      errorMsg.textContent = "Error al conectar con el servidor.";
      error.classList.remove("d-none");
      success.classList.add("d-none");
    }
  });
});
