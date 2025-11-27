import apiClient from "../api/apiClient.js";
import axios from "axios"; // 👈 IMPORTAR axios para getProfileService

export const loginService = async (payload) =>
  (await apiClient.post("/auth/login", payload)).data;

export const registerService = async (payload) =>
  (await apiClient.post("/auth/register", payload)).data;

export const getUsersService = async () =>
  (await apiClient.get("/auth/users")).data;

export const getProfileService = async (token) => {
  if (!token) throw new Error("Token no definido");
  const res = await axios.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
