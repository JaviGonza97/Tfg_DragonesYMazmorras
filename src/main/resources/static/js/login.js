document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("login-form");
  const alertError = document.getElementById("login-alert");
  const alertSuccess = document.getElementById("login-success");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })  // asegúrate que el backend acepte estos campos
      });

      if (!response.ok) {
        alertError.classList.remove("d-none");
        alertSuccess.classList.add("d-none");
        return;
      }

      const data = await response.json();

      // Guardar token JWT y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles
      }));

      alertError.classList.add("d-none");
      alertSuccess.classList.remove("d-none");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    }
  });
});
