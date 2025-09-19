import axios from "axios";

axios.defaults.withCredentials = true; // important for Sanctum cookies
const apiUrl = process.env.REACT_APP_API_URL;

export function getCsrfCookie() {
  return axios.get(`${apiUrl}/sanctum/csrf-cookie`);
}

export function login(email, password) {
  return getCsrfCookie().then(() =>
    axios.post(`${apiUrl}/login`, { email, password })
  );
}

export function register(data) {
  return getCsrfCookie().then(() =>
    axios.post(`${apiUrl}/register`, data)
  );
}

export function logout() {
  return axios.post(`${apiUrl}/logout`);
}

export function fetchUser() {
  return axios.get(`${apiUrl}/user`);
}
