import axios from "axios";

axios.defaults.withCredentials = true; // important for Sanctum cookies

export function getCsrfCookie() {
  return axios.get("http://localhost:8000/sanctum/csrf-cookie");
}

export function login(email, password) {
  return getCsrfCookie().then(() =>
    axios.post("http://localhost:8000/login", { email, password })
  );
}

export function register(data) {
  return getCsrfCookie().then(() =>
    axios.post("http://localhost:8000/register", data)
  );
}

export function logout() {
  return axios.post("http://localhost:8000/logout");
}

export function fetchUser() {
  return axios.get("http://localhost:8000/user");
}
