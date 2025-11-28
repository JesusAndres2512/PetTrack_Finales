// src/services/petsService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_GATEWAY || import.meta.env.VITE_API_APIM_URL;

export const getPets = async () => (await axios.get(`${API_URL}/vet_pets/pets`)).data;
export const createPet = async (data) => (await axios.post(`${API_URL}/vet_pets/pets`, data)).data;
export const updatePet = async (petId, data) => (await axios.put(`${API_URL}/vet_pets/pets/${petId}`, data)).data;
export const deletePet = async (petId) => (await axios.delete(`${API_URL}/vet_pets/pets/${petId}`)).data;
