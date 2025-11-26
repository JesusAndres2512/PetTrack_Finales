import apiClient from "../api/apiClient";

export const getPetsService = async () => (await apiClient.get("/pets")).data;
export const createPetService = async (data) => (await apiClient.post("/pets", data)).data;
