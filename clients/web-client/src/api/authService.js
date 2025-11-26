import apiClient from "../api/apiClient";

export const loginService = async (payload) => (await apiClient.post("/auth/login", payload)).data;
export const registerService = async (payload) => (await apiClient.post("/auth/register", payload)).data;
export const getUsersService = async () => (await apiClient.get("/auth/users")).data;
export const getProfileService = async () => (await apiClient.get("/auth/profile")).data;
export const logoutService = () => { localStorage.clear(); window.location.href = "/login"; };

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
