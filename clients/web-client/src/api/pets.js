import apiClient from "./apiClient";

export const getPets = async () => {
  try {
    return (await apiClient.get("/pets")).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al obtener mascotas" };
  }
};

export const createPet = async (pet) => {
  try {
    return (await apiClient.post("/pets", pet)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al crear mascota" };
  }
};
