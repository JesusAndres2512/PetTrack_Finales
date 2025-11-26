import apiClient from "../api/apiClient";

export const getAppointmentsService = async () => (await apiClient.get("/appointments")).data;
export const createAppointmentService = async (data) => (await apiClient.post("/appointments", data)).data;
