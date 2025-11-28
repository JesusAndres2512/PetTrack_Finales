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

export const updateAppointment = async (appointmentId, appointment) => {
  try {
    return (await apiClient.put(`/appointments/${appointmentId}`, appointment)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al actualizar cita" };
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    return (await apiClient.delete(`/appointments/${appointmentId}`)).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al eliminar cita" };
  }
};
