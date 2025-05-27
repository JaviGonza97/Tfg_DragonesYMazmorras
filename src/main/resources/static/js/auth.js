// auth.js

export async function loginUser(email, password) {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en el login");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("currentUser", JSON.stringify(data));
  return data;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
