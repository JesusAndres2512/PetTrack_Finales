import apiClient from "./apiClient";

export const getPets = async () => {
  try {
    return (await apiClient.get("/vet_pets/pets")).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al obtener mascotas" };
  }
};

export const createPet = async (pet) => {
  try {
    return (await apiClient.post("/vet_pets/pets", pet)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al crear mascota" };
  }
};

export const updatePet = async (petId, pet) => {
  try {
    return (await apiClient.put(`/vet_pets/pets/${petId}`, pet)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al actualizar mascota" };
  }
};

export const deletePet = async (petId) => {
  try {
    return (await apiClient.delete(`/vet_pets/pets/${petId}`)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al eliminar mascota" };
  }
};
