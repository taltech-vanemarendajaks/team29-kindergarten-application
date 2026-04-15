import { API_URL } from "@/src/shared/constants/api";

const AUTH_API_URL = (API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${AUTH_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json(); // { token: "..." }
}

export function logout() {
  localStorage.removeItem("token");
}
