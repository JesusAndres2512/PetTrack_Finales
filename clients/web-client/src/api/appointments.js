import apiClient from "./apiClient";

export const getAppointments = async () => {
  try {
    return (await apiClient.get("/appointments")).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al obtener citas" };
  }
};

export const createAppointment = async (appointment) => {
  try {
    return (await apiClient.post("/appointments", appointment)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al crear cita" };
  }
};
