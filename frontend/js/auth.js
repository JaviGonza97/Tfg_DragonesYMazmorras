// js/auth.js
import { apiRequest } from "./api.js";

export async function loginUser(email, password) {
  const response = await apiRequest("/auth/login", "POST", { email, password });
  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.usuario));
}

export async function registerUser(registroDto) {
  return apiRequest("/auth/register", "POST", registroDto);
}

export async function validateToken() {
  try {
    const user = await apiRequest("/auth/me", "GET", null, true);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    logoutUser();
    return null;
  }
}

export function getUserInfo() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}

export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
