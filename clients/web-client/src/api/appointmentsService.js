// src/services/appointmentsService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_GATEWAY || import.meta.env.VITE_API_APIM_URL;

export const getAppointments = async () => (await axios.get(`${API_URL}/appointments`)).data;
export const createAppointment = async (data) => (await axios.post(`${API_URL}/appointments`, data)).data;
